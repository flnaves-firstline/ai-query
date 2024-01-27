using Dapper;

using PatientQuery.Core.External.OpenAi;

namespace PatientQuery.Core.Services;

public interface IMedicationService
{
    Task<List<int>> GetBrandConceptIds(string medicationString);
    Task<List<string>> GetCodesByBrandIds(List<int> ids);
    Task<string?> GetAtcCodeIfNotBrandAsync(string medicationString);
    Task<List<string>> GetCodesByAtcCode(string className);
}

public class MedicationService : IMedicationService
{
    private readonly IConfigService _config;
    private readonly IAiService _aiService;
    private readonly OmopDapperContext _omopDapperContext;

    public MedicationService(OmopDapperContext omopDapperContext, IAiService aiService, IConfigService config)
    {
        _omopDapperContext = omopDapperContext;
        _aiService = aiService;
        _config = config;
    }

    public async Task<List<int>> GetBrandConceptIds(string medicationString)
    {
        var query = @$"
SELECT c.concept_id
FROM cdm.concept c 
WHERE c.concept_name ILIKE @BrandName
    AND c.concept_class_id = 'Brand Name'
	and c.domain_id = 'Drug'
	and c.vocabulary_id in ('RxNorm', 'RxNorm Extension')
            ";

        using (var connection = _omopDapperContext.CreateConnection())
        {
            var ids = await connection.QueryAsync<int>(query, new { BrandName = medicationString }, commandTimeout: 240);
            return ids.ToList();
        }
    }

    public async Task<List<string>> GetCodesByBrandIds(List<int> ids)
    {
        var query = @$"
WITH RECURSIVE traverse AS (
    -- Base case
    SELECT 
        c1.concept_id AS start_id,
        c1.concept_code AS start_code,
        c2.concept_id,
        c2.concept_code,
        c2.concept_class_id
    FROM 
        cdm.concept c1
    JOIN 
        cdm.concept_relationship cr ON c1.concept_id = cr.concept_id_1 and cr.relationship_id in ('Brand name of')
    JOIN 
        cdm.concept c2 ON cr.concept_id_2 = c2.concept_id and c2.vocabulary_id in ('RxNorm')
    WHERE 
        c1.concept_id = ANY(@Ids)

    UNION ALL

    -- Recursive case
    SELECT 
        t.start_id,
        t.start_code,
        c2.concept_id,
        c2.concept_code,
        c2.concept_class_id
    FROM 
        traverse t
    JOIN 
        cdm.concept_relationship cr ON t.concept_id = cr.concept_id_1 and cr.relationship_id in ('Brand name of')
    JOIN 
        cdm.concept c2 ON cr.concept_id_2 = c2.concept_id and c2.vocabulary_id in ('RxNorm')
)
SELECT
    t.concept_code
FROM 
    traverse t
WHERE 
    t.concept_class_id in ('Clinical Drug', 'Branded Drug', 'Branded Pack', 'Clinical Drug Comp', 'Multiple Ingredients', 'Quant Branded Drug', 'Quant Clinical Drug')
            ";

        using (var connection = _omopDapperContext.CreateConnection())
        {
            var codes = await connection.QueryAsync<string>(query, new { Ids = ids }, commandTimeout: 240);
            return codes.ToList();
        }
    }

    public async Task<string?> GetAtcCodeIfNotBrandAsync(string medicationString)
    {
        var answer = await _aiService.GetChatResponse(
            new List<Message>
            {
                new Message { Role = Role.User, Content = $"If {medicationString} is a drugs brand name then answer \"brand\" else give me corresponding ATC code.\nOutput format:\n[brand or ATC code]" },
            },
            _config.OpenAi.MedicationInfoRequest);

        if (answer == null)
            throw new Exception("Ai error");

        if (answer.Content == "brand")
            return null;

        return answer.Content;
    }

    public async Task<List<string>> GetCodesByAtcCode(string startCode)
    {
        var query = @$"
WITH RECURSIVE traverse AS (
    -- Base case
    SELECT 
        c1.concept_id AS start_id,
        c1.concept_code AS start_code,
        c2.concept_id,
        c2.concept_code,
        c2.concept_class_id
    FROM 
        cdm.concept c1
    JOIN 
        cdm.concept_relationship cr ON c1.concept_id = cr.concept_id_1 and cr.relationship_id in ('Subsumes', 'ATC - RxNorm', 'RxNorm inverse is a')
    JOIN 
        cdm.concept c2 ON cr.concept_id_2 = c2.concept_id and c2.vocabulary_id in ('ATC', 'RxNorm')
    WHERE 
        c1.concept_code = @StartCode
		and c1.domain_id = 'Drug'
		and c1.vocabulary_id = 'ATC'

    UNION ALL

    -- Recursive case
    SELECT 
        t.start_id,
        t.start_code,
        c2.concept_id,
        c2.concept_code,
        c2.concept_class_id
    FROM 
        traverse t
    JOIN 
        cdm.concept_relationship cr ON t.concept_id = cr.concept_id_1 and cr.relationship_id in ('Subsumes', 'ATC - RxNorm', 'RxNorm inverse is a')
    JOIN 
        cdm.concept c2 ON cr.concept_id_2 = c2.concept_id and c2.vocabulary_id in ('ATC', 'RxNorm')
)
SELECT
    t.concept_code
FROM 
    traverse t
WHERE 
    t.concept_class_id in ('Clinical Drug', 'Branded Drug', 'Branded Pack', 'Clinical Drug Comp', 'Multiple Ingredients', 'Quant Branded Drug', 'Quant Clinical Drug')
            ";

        using (var connection = _omopDapperContext.CreateConnection())
        {
            var codes = await connection.QueryAsync<string>(query, new { StartCode = startCode }, commandTimeout: 240);
            return codes.ToList();
        }
    }
}

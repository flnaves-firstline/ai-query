using Dapper;

using PatientQuery.Core.External.OpenAi;

namespace PatientQuery.Core.Services;

public class AiMedicationStringInfoResponse
{
    public string? AtcCode { get; set; }
}

public class TemporaryConceptData
{
    public int ConceptId { get; set; }
    public string ConceptCode { get; set; } = null!;
    public string ConceptClassId { get; set; } = null!;
}

public interface IMedicationService
{
    Task<List<int>> GetBrandConceptIds(string medicationString);
    Task<List<string>> GetCodesByBrandIds(List<int> ids);
    Task<string?> GetAtcCodeAsync(string medicationString);
    Task<List<string>> GetCodesByAtcCode(string className);
}

public class MedicationService : IMedicationService
{
    private readonly IConfigService _config;
    private readonly IAiService _aiService;
    private readonly IrisDapperContext _irisDapperContext;

    public MedicationService(IAiService aiService, IConfigService config, IrisDapperContext irisDapperContext)
    {
        _aiService = aiService;
        _config = config;
        _irisDapperContext = irisDapperContext;
    }

    public async Task<List<int>> GetBrandConceptIds(string medicationString)
    {
        var query = @$"
SELECT c.concept_id
FROM cdm.concept c 
WHERE c.concept_name LIKE @BrandName
    AND c.concept_class_id = 'Brand Name'
	and c.domain_id = 'Drug'
	and c.vocabulary_id IN ('RxNorm', 'RxNorm Extension')
            ";

        using (var connection = _irisDapperContext.CreateConnection())
        {
            var ids = await connection.QueryAsync<int>(query, new { BrandName = medicationString }, commandTimeout: 240);
            return ids.ToList();
        }
    }

    public async Task<List<string>> GetCodesByBrandIds(List<int> ids)
    {
        var connection = _irisDapperContext.CreateConnection();

        var baseQuery = @$"
SELECT 
    c2.concept_id AS ConceptId,
    c2.concept_code AS ConceptCode,
    c2.concept_class_id AS ConceptClassId
FROM 
    cdm.concept c1
JOIN 
    cdm.concept_relationship cr ON c1.concept_id = cr.concept_id_1 and cr.relationship_id in ('Brand name of')
JOIN 
    cdm.concept c2 ON cr.concept_id_2 = c2.concept_id and c2.vocabulary_id in ('RxNorm')
WHERE 
    c1.concept_id IN @Ids
            ";

        var nextQuery = @"
SELECT 
    c2.concept_id AS ConceptId,
    c2.concept_code AS ConceptCode,
    c2.concept_class_id AS ConceptClassId
FROM 
    cdm.concept t
JOIN 
    cdm.concept_relationship cr ON t.concept_id = cr.concept_id_1 and cr.relationship_id in ('Brand name of')
JOIN 
    cdm.concept c2 ON cr.concept_id_2 = c2.concept_id and c2.vocabulary_id in ('RxNorm')
WHERE
    t.concept_id IN @ConceptIds
            ";

        var resultConceptCodes = new List<string>();

        var baseQueryResult = await connection.QueryAsync<TemporaryConceptData>(baseQuery, new { Ids = ids }, commandTimeout: 240);
        var lastRecords = baseQueryResult.ToList();

        do
        {
            resultConceptCodes.AddRange(lastRecords
                .Where(x => new string[] { "Clinical Drug", "Branded Drug", "Branded Pack", "Clinical Drug Comp", "Multiple Ingredients", "Quant Branded Drug", "Quant Clinical Drug" }.Contains(x.ConceptClassId))
                .Select(x => x.ConceptCode));

            var queryResult = await connection.QueryAsync<TemporaryConceptData>(nextQuery, new { ConceptIds = lastRecords.Select(x => x.ConceptId) }, commandTimeout: 240);
            lastRecords = queryResult.ToList();
        }
        while (lastRecords.Any());

        return resultConceptCodes.Distinct().ToList();
    }

    public async Task<string?> GetAtcCodeAsync(string medicationString)
    {
        var answer = await _aiService.GetChatResponse(
            new List<Message>
            {
                new Message { Role = Role.User, Content = $"If \"{medicationString}\" is a generic drugs class name then give me corresponding ATC code.\nOutput json format:\n{{\n  \"atcCode\": <ATC code here or null if it is not a generic drugs class name>\n}}" },
            },
            _config.OpenAi.MedicationInfoRequest);

        if (answer == null)
            throw new Exception("Ai error");

        try
        {
            return answer.Content
                .Replace("```json", string.Empty)
                .Replace("```", string.Empty)
                .Deserialize<AiMedicationStringInfoResponse>()
                .AtcCode;
        }
        catch (Exception)
        {
            throw new Exception("Error occured while processing response from AI service");
        }
    }

    public async Task<List<string>> GetCodesByAtcCode(string startCode)
    {
        var connection = _irisDapperContext.CreateConnection();

        var baseQuery = @$"
SELECT 
    c2.concept_id AS ConceptId,
    c2.concept_code AS ConceptCode,
    c2.concept_class_id AS ConceptClassId
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
            ";

        var nextQuery = @"
SELECT 
    c2.concept_id AS ConceptId,
    c2.concept_code AS ConceptCode,
    c2.concept_class_id AS ConceptClassId
FROM 
    cdm.concept t
JOIN 
    cdm.concept_relationship cr ON t.concept_id = cr.concept_id_1 and cr.relationship_id in ('Subsumes', 'ATC - RxNorm', 'RxNorm inverse is a')
JOIN 
    cdm.concept c2 ON cr.concept_id_2 = c2.concept_id and c2.vocabulary_id in ('ATC', 'RxNorm')
WHERE
    t.concept_id IN @ConceptIds
            ";

        var resultConceptCodes = new List<string>();

        var baseQueryResult = await connection.QueryAsync<TemporaryConceptData>(baseQuery, new { StartCode = startCode }, commandTimeout: 240);
        var lastRecords = baseQueryResult.ToList();

        do
        {
            resultConceptCodes.AddRange(lastRecords
                .Where(x => new string[] { "Clinical Drug", "Branded Drug", "Branded Pack", "Clinical Drug Comp", "Multiple Ingredients", "Quant Branded Drug", "Quant Clinical Drug" }.Contains(x.ConceptClassId))
                .Select(x => x.ConceptCode));

            var queryResult = await connection.QueryAsync<TemporaryConceptData>(nextQuery, new { ConceptIds = lastRecords.Select(x => x.ConceptId) }, commandTimeout: 240);
            lastRecords = queryResult.ToList();
        }
        while (lastRecords.Any());

        return resultConceptCodes.Distinct().ToList();
    }
}

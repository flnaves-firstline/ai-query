using Dapper;

namespace PatientQuery.Core.Services;

public record ClinicalFinding
{
    public string ConceptCode { get; init; } = null!;
    public string ConceptName { get; init; } = null!;
    public string DomainId { get; init; } = null!;
}

public interface IClinicalFindingService
{
    Task<List<ClinicalFinding>> GetClinicalFindingsAsync(List<string> conceptCodes);
}

public class ClinicalFindingService : IClinicalFindingService
{
    private readonly OmopDapperContext _omopDapperContext;

    public ClinicalFindingService(OmopDapperContext omopDapperContext)
    {
        _omopDapperContext = omopDapperContext;
    }

    public async Task<List<ClinicalFinding>> GetClinicalFindingsAsync(List<string> conceptCodes)
    {
        var query = @$"
SELECT 
    c.concept_code as ConceptCode,
    c.concept_name as ConceptName,
    c.domain_id as DomainId
FROM cdm.concept c
WHERE c.vocabulary_id = 'SNOMED'
	AND c.concept_code = ANY(@ConceptCodes)
            ";

        using (var connection = _omopDapperContext.CreateConnection())
        {
            var rows = await connection.QueryAsync<ClinicalFinding>(query, new { ConceptCodes = conceptCodes }, commandTimeout: 240);
            return rows.ToList();
        }
    }
}

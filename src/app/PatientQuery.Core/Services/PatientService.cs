using Dapper;

namespace PatientQuery.Core.Services;

public record PatientListModel
{
    public int Id { get; init; }
    public string? Gender { get; init; }
    public string? Race { get; init; }
    public string? BirthDate { get; init; }
    public string? DeceasedDateTime { get; init; }
    public string? ActiveMedicationNames { get; init; }
    public string? ConditionNames { get; init; }
    public string? ObservationNames { get; init; }
}

public record PatientModel
{
    public int Id { get; init; }
    public string? Gender { get; init; }
    public string? Race { get; init; }
    public string? Ethnicity { get; init; }
    public string? BirthDate { get; init; }
    public string? DeceasedDateTime { get; init; }
    public string? ActiveMedicationNames { get; init; }
    public string? ConditionNames { get; init; }
    public string? ObservationNames { get; init; }
    public string? ProcedureNames { get; init; }
    public string? EncounterDates { get; init; }
}

public interface IPatientService
{
    Task<int> GetPatientsCountAsync();
    Task<IReadOnlyList<PatientListModel>> GetEligiblePatientsAsync(string sqlWhereExpr, DynamicParameters sqlWhereExprParams, List<int>? patientIds);
    Task<PatientModel> GetPatientAsync(int id);
}

public class PatientService : IPatientService
{
    private readonly IrisDapperContext _irisDapperContext;

    public PatientService(IrisDapperContext irisDapperContext)
    {
        _irisDapperContext = irisDapperContext;
    }

    public async Task<IReadOnlyList<PatientListModel>> GetEligiblePatientsAsync(string sqlWhereExpr, DynamicParameters sqlWhereExprParams, List<int>? patientIds)
    {
        using var connection = _irisDapperContext.CreateConnection();

        string whereExpr;
        if (patientIds == null)
        {
            whereExpr = sqlWhereExpr;
        }
        else
        {
            whereExpr = $"p.ID IN @PatientIds AND {sqlWhereExpr}";
            sqlWhereExprParams.Add("@PatientIds", patientIds);
        }

        var queryPatientIds = @$"
SELECT p.ID
FROM TransformationSparta.Patient p
WHERE {whereExpr}
            ";


        var ids = await connection.QueryAsync<int>(queryPatientIds, sqlWhereExprParams, commandTimeout: 240);

        var queryPatients = @$"
SELECT
	p.ID,
	p.Gender,
	p.UsCoreRaceTextValueString as Race,
	p.BirthDate,
	p.DeceasedDateTime,
	LIST(DISTINCT mr.MedicationCodeableConceptText) as ActiveMedicationNames,
	LIST(DISTINCT c.CodeText) as ConditionNames,
	LIST(DISTINCT o.CodeText) as ObservationNames
FROM TransformationSparta.Patient p
LEFT JOIN TransformationSparta.MedicationRequest mr ON p.""Key"" = mr.SubjectReference AND mr.Status = 'active'
LEFT JOIN TransformationSparta.""Condition"" c ON p.""Key"" = c.SubjectReference
LEFT JOIN TransformationSparta.""Observation"" o ON p.""Key"" = o.SubjectReference
WHERE p.ID IN @PatientIds
GROUP BY p.ID
            ";

        var patients = await connection.QueryAsync<PatientListModel>(queryPatients, new { PatientIds = ids }, commandTimeout: 240);
        return patients.ToList();
    }

    public async Task<PatientModel> GetPatientAsync(int id)
    {
        using var connection = _irisDapperContext.CreateConnection();

        var query = @$"
SELECT
	p.ID,
	p.Gender,
	p.UsCoreRaceTextValueString as Race,
	p.UsCoreEthnicityTextValueString as Ethnicity,
	p.BirthDate,
	p.DeceasedDateTime,
	LIST(DISTINCT mr.MedicationCodeableConceptText) as ActiveMedicationNames,
	LIST(DISTINCT c.CodeText) as ConditionNames,
	LIST(DISTINCT o.CodeText) as ObservationNames,
	LIST(DISTINCT pr.CodeText) as ProcedureNames,
	LIST(DISTINCT e.PeriodStart) as EncounterDates
FROM TransformationSparta.Patient p
LEFT JOIN TransformationSparta.MedicationRequest mr ON p.""Key"" = mr.SubjectReference AND mr.Status = 'active'
LEFT JOIN TransformationSparta.""Condition"" c ON p.""Key"" = c.SubjectReference
LEFT JOIN TransformationSparta.""Observation"" o ON p.""Key"" = o.SubjectReference
LEFT JOIN TransformationSparta.""Procedure"" pr ON p.""Key"" = pr.SubjectReference
LEFT JOIN TransformationSparta.""Encounter"" e ON p.""Key"" = e.SubjectReference
WHERE p.ID = @Id
GROUP BY p.ID
            ";

        return await connection.QuerySingleAsync<PatientModel>(query, new { Id = id }, commandTimeout: 240);
    }

    public async Task<int> GetPatientsCountAsync()
    {
        using var connection = _irisDapperContext.CreateConnection();

        var query = @$"
SELECT
	COUNT(*)
FROM TransformationSparta.Patient
            ";

        return await connection.ExecuteScalarAsync<int>(query, commandTimeout: 240);
    }
}

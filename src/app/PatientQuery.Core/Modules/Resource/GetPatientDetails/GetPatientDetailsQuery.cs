using System.ComponentModel.DataAnnotations;

namespace PatientQuery.Core.Modules.Resource.GetPatientDetails;

public record PatientDetails
{
    public int Id { get; init; }
    public string? Gender { get; init; }
    public string? Race { get; init; }
    public string? Ethnicity { get; init; }
    public string? BirthDate { get; init; }
    public bool Deceased { get; init; }
    public IReadOnlyList<string>? ActiveMedicationNames { get; init; }
    public IReadOnlyList<string>? ConditionNames { get; init; }
    public IReadOnlyList<string>? ObservationNames { get; init; }
    public IReadOnlyList<string>? ProcedureNames { get; init; }
    public IReadOnlyList<string>? EncounterDates { get; init; }
}

public record GetPatientDetailsQuery : IQuery<PatientDetails>
{
    [Required]
    public int Id { get; init; }
}

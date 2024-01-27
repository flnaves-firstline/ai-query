namespace PatientQuery.Core.Modules.EligibilityRule;

public record TestResult
{
    public record EligiblePatientPageModel
    {
        public int Id { get; init; }
        public string? Gender { get; init; }
        public string? Race { get; init; }
        public string? BirthDate { get; init; }
        public bool Deceased { get; init; }
        public IReadOnlyList<string>? ActiveMedicationNames { get; init; }
        public IReadOnlyList<string>? ConditionNames { get; init; }
        public IReadOnlyList<string>? ObservationNames { get; init; }
    }

    public IReadOnlyList<EligiblePatientPageModel>? EligiblePatients { get; init; }
    public TransformResult TransformResult { get; init; } = null!;
}

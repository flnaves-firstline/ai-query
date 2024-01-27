namespace PatientQuery.Core.Modules.Resource.GetPatientDetails;

public class GetPatientDetailsHandler : QueryHandler<GetPatientDetailsQuery, PatientDetails>
{
    private readonly IPatientService _patientService;

    public GetPatientDetailsHandler(IPatientService patientService)
    {
        _patientService = patientService;
    }

    public override async Task<PatientDetails> Handle(GetPatientDetailsQuery model)
    {
        var patient = await _patientService.GetPatientAsync(model.Id);
        return new PatientDetails
        {
            Id = patient.Id,
            Gender = patient.Gender,
            Race = patient.Race,
            Ethnicity = patient.Ethnicity,
            BirthDate = patient.BirthDate,
            Deceased = patient.DeceasedDateTime != null,
            ActiveMedicationNames = patient.ActiveMedicationNames?.Split(','),
            ConditionNames = patient.ConditionNames?.Split(','),
            ObservationNames = patient.ObservationNames?.Split(','),
            ProcedureNames = patient.ProcedureNames?.Split(','),
            EncounterDates = patient.EncounterDates?.Split(','),
        };
    }
}

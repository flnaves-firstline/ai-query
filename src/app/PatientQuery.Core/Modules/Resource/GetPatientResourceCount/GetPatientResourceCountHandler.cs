namespace PatientQuery.Core.Modules.Resource.GetPatientResourceCount;

public class GetPatientResourceCountHandler : QueryHandler<GetPatientResourceCountQuery, int>
{
    private readonly IPatientService _patientService;

    public GetPatientResourceCountHandler(IPatientService patientService)
    {
        _patientService = patientService;
    }

    public override async Task<int> Handle(GetPatientResourceCountQuery model)
    {
        return await _patientService.GetPatientsCountAsync();
    }
}

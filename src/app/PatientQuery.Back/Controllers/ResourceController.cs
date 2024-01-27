using PatientQuery.Core.Modules.Resource;
using PatientQuery.Core.Modules.Resource.GetPatientDetails;
using PatientQuery.Core.Modules.Resource.GetPatientResourceCount;

namespace PatientQuery.Back.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class ResourceController : ControllerBase
{
    private readonly IMediator _mediator;

    public ResourceController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public Task<int> GetPatientResourceCount([FromQuery] GetPatientResourceCountQuery model) => _mediator.Send(model);

    [HttpGet]
    public Task<PatientDetails> GetPatientDetails([FromQuery] GetPatientDetailsQuery model) => _mediator.Send(model);
}

using PatientQuery.Core.Modules.EligibilityRule;
using PatientQuery.Core.Modules.EligibilityRule.Test;

namespace PatientQuery.Back.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class EligibilityRuleController : ControllerBase
{
    private readonly IMediator _mediator;

    public EligibilityRuleController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public Task<TestResult> Test([FromBody] TestCommand model) => _mediator.Send(model);
}

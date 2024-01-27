namespace PatientQuery.Core.Modules.EligibilityRule.Test;

public class TestHandler : CommandHandler<TestCommand, TestResult>
{
    private readonly IEligibilityRulesService _eligibilityRuleService;
    private readonly IPatientService _patientService;

    public TestHandler(IEligibilityRulesService eligibilityRuleService, IPatientService patientService)
    {
        _eligibilityRuleService = eligibilityRuleService;
        _patientService = patientService;
    }

    public override async Task<TestResult> Handle(TestCommand command)
    {
        var logicalExprRules = await _eligibilityRuleService.TransformToLogicalExprRulesAsync(command.Text);
        if (logicalExprRules == "error")
            throw BadRequest("The query could not be converted");

        var transformResult = await _eligibilityRuleService.TryTransformToSqlWhereExpressionAsync(logicalExprRules, command.Clarification);
        if (transformResult.AmbiguousValues != null)
        {
            return new TestResult { TransformResult = transformResult };
        }

        var eligiblePatients = await _patientService.GetEligiblePatientsAsync(transformResult.SqlWhereExpr, transformResult.SqlWhereExprParams, command.Ids);

        return new TestResult
        {
            TransformResult = transformResult,
            EligiblePatients = eligiblePatients
                .Select(x => new TestResult.EligiblePatientPageModel
                {
                    Id = x.Id,
                    Gender = x.Gender,
                    Race = x.Race,
                    BirthDate = x.BirthDate,
                    Deceased = x.DeceasedDateTime != null,
                    ActiveMedicationNames = x.ActiveMedicationNames?.Split(','),
                    ConditionNames = x.ConditionNames?.Split(','),
                    ObservationNames = x.ObservationNames?.Split(','),
                })
                .ToList()
        };
    }
}

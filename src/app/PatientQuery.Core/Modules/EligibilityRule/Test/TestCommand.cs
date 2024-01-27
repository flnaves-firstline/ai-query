using System.ComponentModel.DataAnnotations;

namespace PatientQuery.Core.Modules.EligibilityRule.Test;

public record TestCommand : ICommand<TestResult>
{
    [Required]
    public string Text { get; init; } = null!;

    public List<int>? Ids { get; init; }

    public ClarificationModel? Clarification { get; init; }
}


using Antlr4.Runtime.Misc;

namespace PatientQuery.Core.Antlr.EligibilityRule;

public class Rule
{
    public string? Field { get; set; }

    public string? Operator { get; set; }

    public string? Value { get; set; }

    public string? Combinator { get; set; }

    public IEnumerable<Rule>? Rules { get; set; }
}

public class EligibilityRulesVisitor : EligibilityRuleBaseVisitor<Rule>
{
    public override Rule VisitParse([NotNull] EligibilityRuleParser.ParseContext context)
    {
        return base.VisitOrExpr(context.orExpr());
    }

    public override Rule VisitOrExpr([NotNull] EligibilityRuleParser.OrExprContext context)
    {
        var andExprs = context.andExpr();
        if (andExprs.Length > 1)
        {
            return new Rule
            {
                Combinator = "Or",
                Rules = andExprs.Select(x => VisitAndExpr(x)).ToList()
            };
        }
        else if (andExprs.Length == 1)
        {
            return VisitAndExpr(andExprs[0]);
        }

        throw new ArgumentException();
    }

    public override Rule VisitAndExpr([NotNull] EligibilityRuleParser.AndExprContext context)
    {
        var exprs = context.expr();
        if (exprs.Length > 1)
        {
            return new Rule
            {
                Combinator = "And",
                Rules = exprs.Select(x => VisitExpr(x)).ToList()
            };
        }
        else if (exprs.Length == 1)
        {
            return VisitExpr(exprs[0]);
        }

        throw new ArgumentException();
    }

    public override Rule VisitExpr([NotNull] EligibilityRuleParser.ExprContext context)
    {
        var rule = context.rule();
        if (rule != null)
        {
            return VisitRule(rule);
        }

        var orExpr = context.orExpr();
        if (orExpr != null)
        {
            return VisitOrExpr(orExpr);
        }

        throw new ArgumentException();
    }

    public override Rule VisitRule([NotNull] EligibilityRuleParser.RuleContext context)
    {
        return new Rule
        {
            Field = context.field.Text,
            Operator = context.@operator.Text,
            Value = context.value.Text.Trim('"')
        };
    }
}

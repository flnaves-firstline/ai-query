//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     ANTLR Version: 4.9.2
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Generated from c:\Coding\fhir_omop_frontend\PatientQuery.Core\Antlr\EligibilityRule\EligibilityRule.g4 by ANTLR 4.9.2

// Unreachable code detected
#pragma warning disable 0162
// The variable '...' is assigned but its value is never used
#pragma warning disable 0219
// Missing XML comment for publicly visible type or member '...'
#pragma warning disable 1591
// Ambiguous reference in cref attribute
#pragma warning disable 419

using Antlr4.Runtime.Misc;
using Antlr4.Runtime.Tree;

using IToken = Antlr4.Runtime.IToken;

/// <summary>
/// This interface defines a complete generic visitor for a parse tree produced
/// by <see cref="EligibilityRuleParser"/>.
/// </summary>
/// <typeparam name="Result">The return type of the visit operation.</typeparam>
[System.CodeDom.Compiler.GeneratedCode("ANTLR", "4.9.2")]
[System.CLSCompliant(false)]
public interface IEligibilityRuleVisitor<Result> : IParseTreeVisitor<Result>
{
	/// <summary>
	/// Visit a parse tree produced by <see cref="EligibilityRuleParser.parse"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	/// <return>The visitor result.</return>
	Result VisitParse([NotNull] EligibilityRuleParser.ParseContext context);
	/// <summary>
	/// Visit a parse tree produced by <see cref="EligibilityRuleParser.orExpr"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	/// <return>The visitor result.</return>
	Result VisitOrExpr([NotNull] EligibilityRuleParser.OrExprContext context);
	/// <summary>
	/// Visit a parse tree produced by <see cref="EligibilityRuleParser.andExpr"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	/// <return>The visitor result.</return>
	Result VisitAndExpr([NotNull] EligibilityRuleParser.AndExprContext context);
	/// <summary>
	/// Visit a parse tree produced by <see cref="EligibilityRuleParser.expr"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	/// <return>The visitor result.</return>
	Result VisitExpr([NotNull] EligibilityRuleParser.ExprContext context);
	/// <summary>
	/// Visit a parse tree produced by <see cref="EligibilityRuleParser.rule"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	/// <return>The visitor result.</return>
	Result VisitRule([NotNull] EligibilityRuleParser.RuleContext context);
}

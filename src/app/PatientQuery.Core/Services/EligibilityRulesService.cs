using Antlr4.Runtime;

using PatientQuery.Common.Constants;
using PatientQuery.Common.Utils;
using PatientQuery.Core.Antlr.EligibilityRule;
using PatientQuery.Core.External.OpenAi;
using Dapper;

namespace PatientQuery.Core.Services;

public record ClarificationModel
{
    public List<string>? MedicationBrandNames { get; init; }
}

public record AmbiguousValues
{
    public List<string> Medications { get; init; } = null!;
}

public record TransformResult
{
    public string SqlWhereExpr { get; init; } = null!;
    public DynamicParameters SqlWhereExprParams { get; init; } = null!;
    public AmbiguousValues? AmbiguousValues { get; init; }
}

public class AiTransformResponse
{
    public string? Expression { get; set; }
    public string? Error { get; set; }
}

public interface IEligibilityRulesService
{
    public Task<string> TransformToLogicalExprRulesAsync(string text);
    public Task<TransformResult> TryTransformToSqlWhereExpressionAsync(string logicalExpr, ClarificationModel? clarification);
}

public class EligibilityRulesService : IEligibilityRulesService
{
    private readonly IAiService _aiService;
    private readonly EligibilityRulesVisitor _eligibilityRulesVisitor;
    private readonly IConfigService _config;
    private readonly IMedicationService _medicationService;

    public EligibilityRulesService(IAiService aiService, EligibilityRulesVisitor eligibilityRulesVisitor, IConfigService config, IMedicationService medicationService)
    {
        _aiService = aiService;
        _eligibilityRulesVisitor = eligibilityRulesVisitor;
        _config = config;
        _medicationService = medicationService;
    }

    public async Task<string> TransformToLogicalExprRulesAsync(string text)
    {
        var answer = await _aiService.GetChatResponse(
            new List<Message>
            {
                new Message { Role = Role.System, Content = "You will be provided with text of rules for filtering patients. You need to convert this text into the following logical expression format:\n{field1}:{operator1}:\"{value1}\" AND ({field2}:{operator2}:\"{value2}\" OR {field3}:{operator3}:\"{value3}\") ...\n\nHere is a list of fields, available operators and values:\n1) Field - \"life status\"\nOperators: equal\nValues: alive, deceased\n2) Field - \"gender\"\nOperators: equal\nValues: male, female\n3) Field - \"age\"\nOperators: equal, less, less or equal, greater, greater or equal, between\nThe values must be numbers\n4) Field - \"birth date\"\nOperators: equal, less, less or equal, greater, greater or equal, between\nValues to be given in the format \"yyyy-mm-dd\"\n5-6) Field - \"race\", \"ethnicity\"\nOperators: equal, not equal\n6-9) Field - \"diagnosis\", \"medication\", \"procedure\"\nOperators: equal, not equal\n10) Field - \"encounter date\"\nOperators: equal, less, not less, less or equal, not less or equal, greater, not greater, greater or equal, not greater or equal, between\nValues to be given in the format \"yyyy-mm-dd\"\n\nFor the fields where values are not specified, string values straight from the text should be used. When the \"between\" operator is used, the value must contain two values separated by the '^' character. Each group of rules should be in parentheses. I.e. there should not be such result: {rule} AND {rule} OR {rule}. Long to be so \"({rule} AND {rule}) OR {rule}\"or so \"{rule} AND ({rule} OR {rule})\". Use the \"between\" operator for date fields if only the year or month is specified.\nThe query can even be a single word, so always try to select the most appropriate field, even in the most incomprehensible cases. For example, if the query is \"white\", then it is most likely about race.\n\nExample 1.\nQuery: Give me Asian men who were either born before 2000 or in 2002 or had diabetes\nResult: race:equal:\"Asian\" AND gender:equal:\"male\" AND (birth date:less:\"2000-01-01\" OR birth date:between:\"2002-01-01^2002-12-31\" OR diagnosis:equal:\"diabetes\")\n\nExample 2.\nQuery: Find women aged 49 to 56 who have not taken ibuprofen, and who visited a doctor on June 27, 2021\nResult: gender:equal:\"female\" AND age:between:\"49^56\" AND medication:not equal:\"ibuprofen\" AND encounter date:equal:\"2021-07-27\"\n\nExample 3.\nQuery: Show dead patients or live ones, but those who suffered cancer and were born between 1990 and 2000\nResult: life status:equal:\"deceased\" OR (life status:equal:\"alive\" AND diagnosis:equal:\"cancer\" AND birth date:between:\"1990-01-01^2000-12-31\")\n\nReturn the result as json, with the following structure:\n{\n  \"expression\": \"{here is the resulting expression}\",\n  \"error\": \"{here, return the error description if for some reason it is not possible to convert the request}\"\n}" },
                new Message { Role = Role.User, Content = text },
            },
            _config.OpenAi.TransformRequest);

        if (answer == null)
            throw new Exception("Invalid response from AI service");

        AiTransformResponse transformResponse;

        try
        {
            transformResponse = answer.Content
                .Replace("```json", string.Empty)
                .Replace("```", string.Empty)
                .Deserialize<AiTransformResponse>();
        }
        catch (Exception)
        {
            throw new Exception("Error occured while processing response from AI service");
        }

        if (!string.IsNullOrEmpty(transformResponse.Error))
            throw new Exception(transformResponse.Error);

        if (!string.IsNullOrEmpty(transformResponse.Expression))
            return transformResponse.Expression;

        throw new Exception("Invalid response from AI service");
    }

    public async Task<TransformResult> TryTransformToSqlWhereExpressionAsync(string logicalExpr, ClarificationModel? clarification)
    {
        var inputStream = new AntlrInputStream(logicalExpr);
        var lexer = new EligibilityRuleLexer(inputStream);
        var tokenStream = new CommonTokenStream(lexer);
        var parser = new EligibilityRuleParser(tokenStream);
        var parseContext = parser.parse();
        var rules = _eligibilityRulesVisitor.Visit(parseContext);

        var ambiguousValues = new AmbiguousValues
        {
            Medications = new List<string>()
        };

        var sqlWhereExprParams = new DynamicParameters();
        var registerParam = (object paramValue) =>
        {
            var index = sqlWhereExprParams.ParameterNames.Count();
            var paramName = $"@Param{index}";
            sqlWhereExprParams.Add(paramName, paramValue);
            return paramName;
        };

        Func<Rule, Task<string>> getSqlExprAsync = null!;
        getSqlExprAsync = async (Rule rule) =>
        {
            if (!string.IsNullOrWhiteSpace(rule.Field) && !string.IsNullOrWhiteSpace(rule.Operator) && !string.IsNullOrWhiteSpace(rule.Value))
            {
                if (rule.Field == EligibilityRuleFieldConstants.LifeStatus)
                {
                    return TransformLifeStatusRule(rule.Operator, rule.Value, registerParam);
                }
                else if (rule.Field == EligibilityRuleFieldConstants.Gender)
                {
                    return TransformGenderRule(rule.Operator, rule.Value, registerParam);
                }
                else if (rule.Field == EligibilityRuleFieldConstants.BirthDate)
                {
                    return TransformBirthDateRule(rule.Operator, rule.Value, registerParam);
                }
                else if (rule.Field == EligibilityRuleFieldConstants.Age)
                {
                    return TransformAgeRule(rule.Operator, rule.Value, registerParam);
                }
                else if (rule.Field == EligibilityRuleFieldConstants.Race)
                {
                    return TransformRaceRule(rule.Operator, rule.Value, registerParam);
                }
                else if (rule.Field == EligibilityRuleFieldConstants.Ethnicity)
                {
                    return TransformEthnicityRule(rule.Operator, rule.Value, registerParam);
                }
                else if (rule.Field == EligibilityRuleFieldConstants.Medication)
                {
                    var result = await TryTransformMedicationsRuleAsync(rule.Operator, rule.Value, registerParam, clarification?.MedicationBrandNames);
                    if (result.IsAmbiguity && !ambiguousValues.Medications.Contains(rule.Value))
                    {
                        ambiguousValues.Medications.Add(rule.Value);
                    }
                    return result.Expr;
                }
                else if (rule.Field == EligibilityRuleFieldConstants.Diagnosis)
                {
                    return TransformDiagnosesRule(rule.Operator, rule.Value, registerParam);
                }
                else if (rule.Field == EligibilityRuleFieldConstants.Procedure)
                {
                    return TransformProceduresRule(rule.Operator, rule.Value, registerParam);
                }
                else if (rule.Field == EligibilityRuleFieldConstants.EncounterDate)
                {
                    return TransformEncounterDateRule(rule.Operator, rule.Value, registerParam);
                }

                throw new Exception();
            }
            else if (!string.IsNullOrWhiteSpace(rule.Combinator) && rule.Rules?.Any() == true)
            {
                var exprs = rule.Rules
                    .Select(async x => await getSqlExprAsync(x))
                    .Select(x => x.Result);
                return $"({string.Join($" {rule.Combinator} ", exprs)})";
            }
            else
            {
                throw new ArgumentException();
            }
        };

        return new TransformResult
        {
            SqlWhereExpr = await getSqlExprAsync(rules),
            SqlWhereExprParams = sqlWhereExprParams,
            AmbiguousValues = ambiguousValues.Medications.Any()
                ? ambiguousValues
                : null
        };
    }

    private string TransformLifeStatusRule(string op, string value, Func<object, string> registerParam)
    {
        var (@operator, _) = TransformComparisonOperator(op);
        return $"(CASE WHEN p.DeceasedDateTime IS NULL THEN 'alive' ELSE 'deceased' END) {@operator} {registerParam(value)}";
    }

    private string TransformGenderRule(string op, string value, Func<object, string> registerParam)
    {
        return $"p.Gender {TransformComparisonOperator(op).Operator} {registerParam(value)}";
    }

    private string TransformBirthDateRule(string op, string value, Func<object, string> registerParam)
    {
        string expr;
        if (op == EligibilityRuleOperatorConstants.Between)
        {
            var values = value.Split('^');
            expr = $"({registerParam(values[0])} <= p.BirthDate AND p.BirthDate <= {registerParam(values[1])})";
        }
        else
        {
            expr = $"p.BirthDate {TransformComparisonOperator(op).Operator} {registerParam(value)}";
        }
        return expr;
    }

    private string TransformAgeRule(string op, string value, Func<object, string> registerParam)
    {
        if (op == EligibilityRuleOperatorConstants.Between)
        {
            var values = value.Split('^');
            var from = int.Parse(values[0]);
            var to = int.Parse(values[1]);
            var leftDobRange = DateTimeHelper.AgeToDob(to);
            var rightDobRange = DateTimeHelper.AgeToDob(from);
            return TransformBirthDateRule(EligibilityRuleOperatorConstants.Between, $"{leftDobRange.From.ToIso8601Date()}^{rightDobRange.To.ToIso8601Date()}", registerParam);
        }
        else
        {
            var age = int.Parse(value);
            var dobRange = DateTimeHelper.AgeToDob(age);
            return op switch
            {
                EligibilityRuleOperatorConstants.Equal => TransformBirthDateRule(EligibilityRuleOperatorConstants.Between, $"{dobRange.From.ToIso8601Date()}^{dobRange.To.ToIso8601Date()}", registerParam),
                EligibilityRuleOperatorConstants.Less => TransformBirthDateRule(EligibilityRuleOperatorConstants.Greater, dobRange.To.ToIso8601Date(), registerParam),
                EligibilityRuleOperatorConstants.LessOrEqual => TransformBirthDateRule(EligibilityRuleOperatorConstants.GreaterOrEqual, dobRange.From.ToIso8601Date(), registerParam),
                EligibilityRuleOperatorConstants.Greater => TransformBirthDateRule(EligibilityRuleOperatorConstants.Less, dobRange.From.ToIso8601Date(), registerParam),
                EligibilityRuleOperatorConstants.GreaterOrEqual => TransformBirthDateRule(EligibilityRuleOperatorConstants.LessOrEqual, dobRange.To.ToIso8601Date(), registerParam),
                _ => throw new ArgumentException()
            };
        }
    }

    private string TransformRaceRule(string op, string value, Func<object, string> registerParam)
    {
        return $"p.UsCoreRaceTextValueString {TransformComparisonOperator(op).Operator} {registerParam(value)}";
    }

    private string TransformEthnicityRule(string op, string value, Func<object, string> registerParam)
    {
        return $"p.UsCoreEthnicityTextValueString {TransformComparisonOperator(op).Operator} {registerParam(value)}";
    }

    private async Task<(string Expr, bool IsAmbiguity)> TryTransformMedicationsRuleAsync(string op, string value, Func<object, string> registerParam, List<string>? medicationBrandNames)
    {
        List<string> codes;

        if (medicationBrandNames != null)
        {
            if (medicationBrandNames.Contains(value))
            {
                var brandConceptIds = await _medicationService.GetBrandConceptIds(value);
                codes = await _medicationService.GetCodesByBrandIds(brandConceptIds);
            }
            else
            {
                var atcCode = await _medicationService.GetAtcCodeAsync(value);
                if (atcCode != null)
                {
                    codes = await _medicationService.GetCodesByAtcCode(atcCode);
                }
                else
                {
                    throw new Exception();
                }
            }
        }
        else
        {
            var brandConceptIds = await _medicationService.GetBrandConceptIds(value);
            var atcCode = await _medicationService.GetAtcCodeAsync(value);
            if (atcCode != null && !brandConceptIds.Any())
            {
                codes = await _medicationService.GetCodesByAtcCode(atcCode);
            }
            else if (atcCode == null && brandConceptIds.Any())
            {
                codes = await _medicationService.GetCodesByBrandIds(brandConceptIds);
            }
            else if (atcCode != null && brandConceptIds.Any())
            {
                return (string.Empty, true);
            }
            else
            {
                throw new Exception();
            }
        }

        var (@operator, _) = TransformComparisonOperator(op);

        var expression = @$"
{(@operator == "=" ? "" : "NOT")} EXISTS (
    SELECT 1
    FROM TransformationSparta.MedicationRequest mr
    WHERE p.""Key"" = mr.SubjectReference
        AND mr.Status = 'active'
        AND mr.MedicationCodeableConceptCodingCode IN {registerParam(codes)}
)
            ";

        return
        (
            expression,
            false
        );
    }

    private string TransformDiagnosesRule(string op, string value, Func<object, string> registerParam)
    {
        var (@operator, _) = TransformComparisonOperator(op);

        return @$"
{(@operator == "=" ? "" : "NOT")} EXISTS (
    SELECT 1
    FROM TransformationSparta.Condition c
    WHERE p.""Key"" = c.SubjectReference
        AND c.CodeText LIKE {registerParam($"%{value}%")}
)
            ";
    }

    private string TransformProceduresRule(string op, string value, Func<object, string> registerParam)
    {
        var (@operator, _) = TransformComparisonOperator(op);

        return @$"
{(@operator == "=" ? "" : "NOT")} EXISTS (
    SELECT 1
    FROM TransformationSparta.Procedure pr
    WHERE p.""Key"" = pr.SubjectReference
        AND pr.CodeText LIKE {registerParam($"%{value}%")}
)
            ";
    }

    private string TransformEncounterDateRule(string op, string value, Func<object, string> registerParam)
    {
        if (op == EligibilityRuleOperatorConstants.Between)
        {
            var values = value.Split('^');
            return @$"
EXISTS (
    SELECT 1
    FROM TransformationSparta.Encouner e
    WHERE p.""Key"" = e.SubjectReference
        AND {registerParam(values[0])} <= e.PeriodStart AND e.PeriodStart <= {registerParam(values[1])}
)
            ";
        }
        else
        {
            var (@operator, isNegation) = TransformComparisonOperator(op);
            return @$"
{(isNegation ? "NOT" : "")} EXISTS (
    SELECT 1
    FROM TransformationSparta.Encouner e
    WHERE p.""Key"" = e.SubjectReference
        AND e.PeriodStart @operator {registerParam(value)}
)
                ";
        }
    }

    private (string Operator, bool IsNegation) TransformComparisonOperator(string op)
    {
        return op switch
        {
            EligibilityRuleOperatorConstants.Equal => ("=", false),
            EligibilityRuleOperatorConstants.Less => ("<", false),
            EligibilityRuleOperatorConstants.LessOrEqual => ("<=", false),
            EligibilityRuleOperatorConstants.Greater => (">", false),
            EligibilityRuleOperatorConstants.GreaterOrEqual => (">=", false),
            EligibilityRuleOperatorConstants.NotEqual => ("!=", true),
            EligibilityRuleOperatorConstants.NotLess => (">=", true),
            EligibilityRuleOperatorConstants.NotLessOrEqual => (">", true),
            EligibilityRuleOperatorConstants.NotGreater => ("<=", true),
            EligibilityRuleOperatorConstants.NotGreaterOrEqual => ("<", true),
            _ => throw new ArgumentException()
        };
    }
}

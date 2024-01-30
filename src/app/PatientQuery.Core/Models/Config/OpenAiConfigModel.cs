namespace PatientQuery.Core.Models.Config;

public class ResponseFormat
{
    public string Type { get; set; } = null!;
}

public class OpenAiRequestModel
{
    public string Model { get; set; } = null!;

    public double? Temperature { get; set; }

    public double? TopP { get; set; }

    public int? Number { get; set; }

    public int? MaxTokens { get; set; }

    public double? PresencePenalty { get; set; }

    public double? FrequencyPenalty { get; set; }

    public ResponseFormat? ResponseFormat { get; set; }
}

public class OpenAiConfigModel
{
    public string Url { get; set; } = null!;

    public string ApiKey { get; set; } = null!;

    public OpenAiRequestModel TransformRequest { get; set; } = null!;

    public OpenAiRequestModel MedicationInfoRequest { get; set; } = null!;
}

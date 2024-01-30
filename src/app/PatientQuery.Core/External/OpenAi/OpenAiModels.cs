using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace PatientQuery.Core.External.OpenAi;

public enum Role
{
    [EnumMember(Value = "system")]
    System = 1,

    [EnumMember(Value = "assistant")]
    Assistant = 2,

    [EnumMember(Value = "user")]
    User = 3,

    [EnumMember(Value = "function")]
    Function = 4,
}

public class Message
{
    public Role Role { get; set; }

    public string Content { get; set; }

    public string? Name { get; set; }
}

public class ChatCompletionRequest
{
    public string Model { get; set; }

    public List<Message> Messages { get; set; }

    public double? Temperature { get; set; }

    [JsonPropertyName("top_p")]
    public double? TopP { get; set; }

    [JsonPropertyName("n")]
    public int? Number { get; set; }

    [JsonPropertyName("max_tokens")]
    public int? MaxTokens { get; set; }

    [JsonPropertyName("presence_penalty")]
    public double? PresencePenalty { get; set; }

    [JsonPropertyName("frequency_penalty")]
    public double? FrequencyPenalty { get; set; }

    [JsonPropertyName("response_format")]
    public ResponseFormat? ResponseFormat { get; set; }

    public string? User { get; set; }
}

public class ResponseFormat
{
    public string Type { get; set; } = null!;
}

public partial class Usage
{
    [JsonPropertyName("prompt_tokens")]
    public long PromptTokens { get; set; }

    [JsonPropertyName("completion_tokens")]
    public long CompletionTokens { get; set; }

    [JsonPropertyName("total_tokens")]
    public long TotalTokens { get; set; }
}

public partial class Choice
{
    public long Index { get; set; }

    public Message Message { get; set; }

    [JsonPropertyName("finish_reason")]
    public string FinishReason { get; set; }
}

public partial class ChatCompletionResponse
{
    public string Id { get; set; }

    public string Object { get; set; }

    public long Created { get; set; }

    public List<Choice> Choices { get; set; }

    public Usage Usage { get; set; }
}

public class EmbeddingRequest
{
    public string Model { get; set; }

    public string Input { get; set; }

    public string? User { get; set; }
}

public class EmbeddingData
{
    public string Object { get; set; }

    public float[] Embedding { get; set; }

    public int Index { get; set; }
}

public class EmbeddingResponse
{
    public string Object { get; set; }

    public string Model { get; set; }

    public List<EmbeddingData> Data { get; set; }

    public Usage Usage { get; set; }
}

using System.Text.Json.Serialization;

using Microsoft.Extensions.Logging;

using PatientQuery.Common.Utils;

namespace PatientQuery.Core.External.OpenAi;

public interface IAiService
{
    Task<Message?> GetChatResponse(List<Message> messages, OpenAiRequestModel settings);
}

public class OpenAiService : IAiService
{
    private readonly IConfigService _config;
    private readonly ILogger<OpenAiService> _logger;
    private HttpClient _httpClient;
    private JsonSerializerOptions _jsonSettings;

    public OpenAiService(IHttpClientFactory httpClientFactory, IConfigService config, ILogger<OpenAiService> logger)
    {
        _httpClient = httpClientFactory.CreateClient(string.Empty);
        _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", config.OpenAi.ApiKey);
        _config = config;
        _logger = logger;
        _jsonSettings = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };
        _jsonSettings.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    }

    public async Task<Message?> GetChatResponse(List<Message> messages, OpenAiRequestModel settings)
    {
        var request = new ChatCompletionRequest
        {
            Model = settings.Model,
            Messages = messages,
            Temperature = settings.Temperature,
            TopP = settings.TopP,
            Number = settings.Number,
            MaxTokens = settings.MaxTokens,
            PresencePenalty = settings.PresencePenalty,
            FrequencyPenalty = settings.FrequencyPenalty,
            ResponseFormat = settings.ResponseFormat != null
                ? new ResponseFormat
                {
                    Type = settings.ResponseFormat.Type
                }
                : null
        };
        var jsonData = JsonSerializer.Serialize(request, _jsonSettings);
        var requestContent = new StringContent(jsonData, Encoding.UTF8, "application/json");
        var url = new Uri(new Uri(_config.OpenAi.Url), "v1/chat/completions");
        var response = await _httpClient.PostAsync(url, requestContent);
        var responseContent = await response.Content.ReadAsStringAsync();
        if (response.IsSuccessStatusCode)
        {
            _logger.LogTrace($"OpenAI GetChatResponse response url: <{url}>, status code: <{response.StatusCode}>, content: <{responseContent}>");
            var chatResponse = JsonSerializer.Deserialize<ChatCompletionResponse>(responseContent, _jsonSettings);
            return chatResponse?.Choices?.FirstOrDefault()?.Message;
        }
        else
        {
            _logger.LogError($"OpenAI GetChatResponse response url: <{url}>, status code: <{response.StatusCode}>, content: <{responseContent}>");
        }
        return null;
    }
}

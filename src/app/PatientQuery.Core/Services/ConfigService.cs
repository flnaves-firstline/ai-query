namespace PatientQuery.Core.Services;

public interface IConfigService
{
    JsonSerializerOptions JsonSettings { get; }
    string AppVersion { get; }
    string IrisConnectionString { get; }
    OpenAiConfigModel OpenAi { get; }
}

public class ConfigService : IConfigService
{
    public JsonSerializerOptions JsonSettings { get; } = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DictionaryKeyPolicy = JsonNamingPolicy.CamelCase
    };
    private readonly IConfiguration _config;

    public ConfigService(IConfiguration config)
    {
        _config = config;
    }

    public string IrisConnectionString => _config.GetSection("Connections").GetValue<string>("Iris");
    public string AppVersion => _config.GetValue<string>("AppVersion");
    public OpenAiConfigModel OpenAi => _config.GetSection("OpenAi").Get<OpenAiConfigModel>();
}

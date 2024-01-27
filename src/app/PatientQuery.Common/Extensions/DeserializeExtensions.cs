using System.Text.Json;

namespace PatientQuery.Common.Extensions;

public static class DeserializeExtensions
{
    private static JsonSerializerOptions defaultSerializerSettings = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static T Deserialize<T>(this string json)
    {
        return JsonSerializer.Deserialize<T>(json, defaultSerializerSettings);
    }
}

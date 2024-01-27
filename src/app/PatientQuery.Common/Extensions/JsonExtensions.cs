using System.Text.Json;

namespace PatientQuery.Common.Extensions
{
    public static class JsonExtensions
    {
        public static JsonElement? Get(this JsonElement self, string name) => self.TryGetProperty(name, out var value) ? value : null;
    }
}

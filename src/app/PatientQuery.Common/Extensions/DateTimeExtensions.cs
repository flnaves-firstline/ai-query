namespace PatientQuery.Common.Extensions
{
    public static class DateTimeExtensions
    {
        public static string ToIso8601Date(this DateTime self)
        {
            return self.ToString("yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
        }
    }
}

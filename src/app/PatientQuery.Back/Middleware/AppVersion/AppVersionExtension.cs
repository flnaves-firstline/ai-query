namespace PatientQuery.Back.Middleware;
public static class AppVersionExtension
{
    public static IApplicationBuilder UseAppVersion(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AppVersionMiddleware>();
    }
}

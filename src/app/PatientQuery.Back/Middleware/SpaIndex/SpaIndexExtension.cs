namespace PatientQuery.Back.Middleware;
public static class SpaIndexExtension
{
    public static IApplicationBuilder UseSpaIndex(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<SpaIndexMiddleware>();
    }
}

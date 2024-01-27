namespace PatientQuery.Back.Middleware.Cqrs;
public static class CqrsExtension
{
    public static IApplicationBuilder UseCqrs(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<CqrsMiddleware>();
    }
}

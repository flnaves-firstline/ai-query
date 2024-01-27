namespace PatientQuery.Back.Middleware;
public static class ExceptionConverterExtension
{
    public static IApplicationBuilder UseExceptionConverter(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ExceptionConverterMiddleware>();
    }
}

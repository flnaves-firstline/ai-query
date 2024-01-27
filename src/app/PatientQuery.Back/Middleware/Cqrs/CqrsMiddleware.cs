namespace PatientQuery.Back.Middleware.Cqrs;
public class CqrsMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfigService _config;

    public CqrsMiddleware(RequestDelegate next, IConfigService config)
    {
        _next = next;
        _config = config;
    }


    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception e)
        {
            if (e is BadRequestException badRequest)
                await ReturnError(context, e, StatusCodes.Status400BadRequest);
            else if (e is NotFoundException notFound)
                await ReturnError(context, e, StatusCodes.Status404NotFound);
            else if (e is ForbiddenException forbidden)
                await ReturnError(context, e, StatusCodes.Status403Forbidden);
            else
                throw;
        }
    }

    private async Task ReturnError(HttpContext context, Exception e, int statusCode)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        var jsonString = JsonSerializer.Serialize(new CommonResponse
        {
            IsError = true,
            Message = e.GetFullExceptionMessage(),
            Description = e.ToString()
        }, _config.JsonSettings);
        await context.Response.WriteAsync(jsonString, Encoding.UTF8);
    }
}

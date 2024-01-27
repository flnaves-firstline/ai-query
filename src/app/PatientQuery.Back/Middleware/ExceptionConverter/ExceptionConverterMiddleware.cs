namespace PatientQuery.Back.Middleware;
public class ExceptionConverterMiddleware
{
    private readonly ILogger<ExceptionConverterMiddleware> _logger;
    private readonly RequestDelegate _next;
    private readonly JsonSerializerOptions _jsonSettings = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public ExceptionConverterMiddleware(RequestDelegate next, ILogger<ExceptionConverterMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }


    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Unhandled exception");
            if (!context.Response.HasStarted)
            {
                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";
                var jsonString = JsonSerializer.Serialize(new CommonResponse
                {
                    IsError = true,
                    Message = e.GetFullExceptionMessage(),
                    Description = e.ToString()
                }, _jsonSettings);
                await context.Response.WriteAsync(jsonString, Encoding.UTF8);
            }
        }
    }
}

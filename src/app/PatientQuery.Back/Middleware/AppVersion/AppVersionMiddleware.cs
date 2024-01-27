namespace PatientQuery.Back.Middleware;

public class AppVersionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfigService _config;

    public AppVersionMiddleware(RequestDelegate next, IConfigService config)
    {
        _next = next;
        _config = config;
    }

    public async Task Invoke(HttpContext context)
    {
        var path = context.Request.Path.Value;
        if (!context.Request.Headers.ContainsKey("appVersion") || context.Request.Headers["appVersion"] == _config.AppVersion)
            await _next(context);
        else
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "application/json";
            var jsonString = JsonSerializer.Serialize(new CommonResponse
            {
                IsError = true,
                Message = "Frontend version is outdated. You should reload the app. #frontend_outdated!"
            }, _config.JsonSettings);
            await context.Response.WriteAsync(jsonString, Encoding.UTF8);
        }
    }
}

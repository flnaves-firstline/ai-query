namespace PatientQuery.Back.Middleware;
public class SpaIndexMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfigService _config;
    private readonly ILogger<SpaIndexMiddleware> _logger;

    public SpaIndexMiddleware(RequestDelegate next, IConfigService config, ILogger<SpaIndexMiddleware> logger)
    {
        _next = next;
        _config = config;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        var path = context.Request.Path.Value;
        if (!path.StartsWith("/api") && !path.StartsWith("/external") && !Path.HasExtension(path))
        {
            var jsonString = JsonSerializer.Serialize(new
            {
                appVersion = _config.AppVersion,
            }, _config.JsonSettings);

            var file = new FileInfo(@"wwwroot/index.html");
            if (file.Exists)
            {
                context.Response.StatusCode = StatusCodes.Status200OK;
                context.Response.ContentType = "text/html";
                var html = await File.ReadAllTextAsync(file.FullName);
                html = html.Replace("<!-- config -->", $@"<script>window.appSettings = {jsonString};</script>");
                await context.Response.WriteAsync(html, Encoding.UTF8);
            }
            else
            {
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                context.Response.ContentType = "text/plain";
                await context.Response.WriteAsync("Unable to find the Index file", Encoding.UTF8);
            }
        }
        else
        {
            await _next(context);
        }
    }
}

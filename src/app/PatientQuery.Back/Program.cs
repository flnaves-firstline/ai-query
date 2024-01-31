using System.Globalization;

using Microsoft.EntityFrameworkCore;

using NLog;
using NLog.Web;

using PatientQuery.Back.Middleware;
using PatientQuery.Back.Middleware.Cqrs;
using PatientQuery.Core;
using PatientQuery.Core.Antlr.EligibilityRule;
using PatientQuery.Core.External.OpenAi;
using PatientQuery.Db;

Thread.CurrentThread.CurrentCulture = CultureInfo.InvariantCulture;
Thread.CurrentThread.CurrentUICulture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;

var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();

try
{
    logger.Info("Start");
    var builder = WebApplication.CreateBuilder(args);
    builder.Logging.ClearProviders();
    builder.Logging.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Trace);
    builder.Host.UseNLog();

    var config = new ConfigService(builder.Configuration);
    builder.Services.AddSingleton<IConfigService>(config);

    //db
    builder.Services.AddDbContext<DatabaseContext>(options =>
        options.UseNpgsql(config.ConnectionString, builder => builder.SetPostgresVersion(new Version(13, 4))));
    builder.Services.AddSingleton(new IrisDapperContext(config.IrisConnectionString));

    //web
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.CustomSchemaIds(type => type.ToString());
    });
    builder.Services.AddResponseCompression();

    //services
    builder.Services.AddMediatR(typeof(Anchor).Assembly);
    builder.Services.AddScoped<IContextService, ContextService>();
    builder.Services.AddScoped<IAiService, OpenAiService>();
    builder.Services.AddScoped<EligibilityRulesVisitor>();
    builder.Services.AddScoped<IEligibilityRulesService, EligibilityRulesService>();
    builder.Services.AddScoped<IMedicationService, MedicationService>();
    builder.Services.AddSingleton<IClinicalFindingService, ClinicalFindingService>();
    builder.Services.AddSingleton<IPatientService, PatientService>();

    builder.Services.AddHttpClient();

    builder.Services.AddLazyCache();

    //build app
    var app = builder.Build();

    using (var scope = app.Services.CreateScope())
    {
        await using (var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>())
        {
            //apply migrations
            await dbContext.Database.MigrateAsync();
        }
    }

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseResponseCompression();
    app.UseExceptionConverter();

    app.UseSpaIndex();
    app.UseCqrs();
    app.UseStaticFiles();
    app.UseAppVersion();

    app.UseRouting();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception e)
{
    logger.Error(e, "Stopped program because of exception");
    throw;
}
finally
{
    NLog.LogManager.Shutdown();
}

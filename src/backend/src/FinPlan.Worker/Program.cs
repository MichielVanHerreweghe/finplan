using FinPlan.Application;
using FinPlan.Domain.Common;
using FinPlan.Infrastructure;
using FinPlan.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Quartz;

HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);

builder.Services.RegisterApplication();
builder.Services.RegisterApplicationInfrastructure(builder.Configuration);

// Background work has no HttpContext, so the owner is set explicitly per owner scope by the job.
// One AsyncLocal-backed instance serves both the concrete type (the job calls Use) and the
// ICurrentOwnerProvider the DbContext reads.
builder.Services.AddSingleton<AmbientCurrentOwnerProvider>();
builder.Services.AddSingleton<ICurrentOwnerProvider>(
    sp => sp.GetRequiredService<AmbientCurrentOwnerProvider>());

builder.Services.AddQuartz(quartz =>
{
    JobKey jobKey = new("recurring-transactions");
    quartz.AddJob<RecurringTransactionsJob>(jobKey);

    // Daily at 00:05 UTC. A missed window fires once (catch-up is handled in the domain by
    // generating every occurrence from the cursor to today, not by Quartz re-firing).
    quartz.AddTrigger(trigger => trigger
        .ForJob(jobKey)
        .WithCronSchedule("0 5 0 * * ?", schedule => schedule
            .InTimeZone(TimeZoneInfo.Utc)
            .WithMisfireHandlingInstructionFireAndProceed()));
});

builder.Services.AddQuartzHostedService(options => options.WaitForJobsToComplete = true);

IHost host = builder.Build();
host.Run();

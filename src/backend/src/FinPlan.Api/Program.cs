using FinPlan.Api.GraphQL.DataLoaders;
using FinPlan.Api.GraphQL.Errors;
using FinPlan.Api.GraphQL.Mutations;
using FinPlan.Api.GraphQL.Queries;
using FinPlan.Api.GraphQL.Types;
using FinPlan.Api.Health;
using FinPlan.Api.Security;
using FinPlan.Application;
using FinPlan.Domain.Common;
using FinPlan.Infrastructure;
using FinPlan.Infrastructure.Database;
using HotChocolate.AspNetCore;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.RegisterApplication();
builder.Services.RegisterApplicationInfrastructure(builder.Configuration);

// Per-request identity: the owner provider feeds the DbContext query filter, and JIT
// provisioning resolves/creates the local User from the validated token's claims.
builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<ICurrentOwnerProvider, HttpCurrentOwnerProvider>();
builder.Services.AddScoped<ICurrentUserProvider, HttpCurrentUserProvider>();
builder.Services.AddScoped<IUserProvisioningService, UserProvisioningService>();

builder.Services.AddFinPlanAuthentication(builder.Configuration);
builder.Services.AddAuthorization();

// Kubernetes probes. "live" runs no checks (process-up = healthy); "ready" gates traffic on
// the database being reachable so a pod with a broken DB connection is pulled from rotation.
builder.Services.AddScoped<DatabaseHealthCheck>();
builder.Services
    .AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>("database", tags: ["ready"]);

builder.Services
    .AddGraphQLServer()
    .AddAuthorization()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddMutationConventions()
    .AddTypeExtension<TransactionResponseType>()
    .AddTypeExtension<TransactionCategoryResponseType>()
    .AddDataLoader<CategoryByIdDataLoader>()
    .AddDataLoader<TransactionsByCategoryIdDataLoader>()
    .AddErrorFilter<RequestExceptionFilter>()
    .ModifyOptions(options =>
        options.DefaultQueryDependencyInjectionScope = DependencyInjectionScope.Resolver);

WebApplication app = builder.Build();

// Database migrations:
//   * "migrate" command — apply pending migrations and exit. The Helm pre-upgrade Job runs
//     this so schema changes land before the new API rolls out, with no multi-replica races.
//   * Development — auto-apply on startup for a friction-free local loop.
bool migrateAndExit = args.Contains("migrate");
if (migrateAndExit || app.Environment.IsDevelopment())
{
    using IServiceScope scope = app.Services.CreateScope();
    ApplicationDbContext dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await dbContext.Database.MigrateAsync();

    if (migrateAndExit)
    {
        return;
    }
}

app.UseAuthentication();
app.UseAuthorization();

// Must run after authentication (needs the principal) and before GraphQL (so the resolved
// owner id is in HttpContext.Items by the time any resolver/DataLoader queries the DbContext).
// JIT provisioning resolves the acting user + personal owner; the active-context step then
// resolves and authorizes the effective owner (personal or a group the user belongs to).
app.UseMiddleware<JitProvisioningMiddleware>();
app.UseMiddleware<ActiveContextMiddleware>();

app.MapGraphQL()
    .WithOptions((GraphQLServerOptions options) =>
        options.Tool.Enable = app.Environment.IsDevelopment());

// Liveness has no dependencies; readiness runs only the "ready"-tagged checks (the DB probe).
app.MapHealthChecks("/health/live", new HealthCheckOptions { Predicate = _ => false })
    .AllowAnonymous();
app.MapHealthChecks("/health/ready", new HealthCheckOptions { Predicate = check => check.Tags.Contains("ready") })
    .AllowAnonymous();

app.Run();

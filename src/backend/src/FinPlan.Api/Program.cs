using FinPlan.Api.GraphQL.DataLoaders;
using FinPlan.Api.GraphQL.Errors;
using FinPlan.Api.GraphQL.Mutations;
using FinPlan.Api.GraphQL.Queries;
using FinPlan.Api.GraphQL.Types;
using FinPlan.Api.Security;
using FinPlan.Application;
using FinPlan.Domain.Common;
using FinPlan.Infrastructure;
using FinPlan.Infrastructure.Database;
using HotChocolate.AspNetCore;
using Microsoft.EntityFrameworkCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.RegisterApplication();
builder.Services.RegisterApplicationInfrastructure(builder.Configuration);

// Per-request identity: the owner provider feeds the DbContext query filter, and JIT
// provisioning resolves/creates the local User from the validated token's claims.
builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<ICurrentOwnerProvider, HttpCurrentOwnerProvider>();
builder.Services.AddScoped<IUserProvisioningService, UserProvisioningService>();

builder.Services.AddFinPlanAuthentication(builder.Configuration);
builder.Services.AddAuthorization();

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

if (app.Environment.IsDevelopment())
{
    using IServiceScope scope = app.Services.CreateScope();
    ApplicationDbContext dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await dbContext.Database.MigrateAsync();
}

app.UseAuthentication();
app.UseAuthorization();

// Must run after authentication (needs the principal) and before GraphQL (so the resolved
// owner id is in HttpContext.Items by the time any resolver/DataLoader queries the DbContext).
app.UseMiddleware<JitProvisioningMiddleware>();

app.MapGraphQL()
    .WithOptions((GraphQLServerOptions options) =>
        options.Tool.Enable = app.Environment.IsDevelopment());

app.Run();

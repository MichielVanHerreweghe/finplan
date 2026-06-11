using FinPlan.Api.GraphQL.DataLoaders;
using FinPlan.Api.GraphQL.Errors;
using FinPlan.Api.GraphQL.Mutations;
using FinPlan.Api.GraphQL.Queries;
using FinPlan.Api.GraphQL.Types;
using FinPlan.Application;
using FinPlan.Infrastructure;
using FinPlan.Infrastructure.Database;
using HotChocolate.AspNetCore;
using Microsoft.EntityFrameworkCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.RegisterApplication();
builder.Services.RegisterApplicationInfrastructure(builder.Configuration);

builder.Services
    .AddGraphQLServer()
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

app.MapGraphQL()
    .WithOptions((GraphQLServerOptions options) =>
        options.Tool.Enable = app.Environment.IsDevelopment());

app.Run();

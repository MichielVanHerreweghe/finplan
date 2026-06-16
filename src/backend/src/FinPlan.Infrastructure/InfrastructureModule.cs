using FinPlan.Domain.Activities;
using FinPlan.Domain.Common;
using FinPlan.Domain.Groups;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using FinPlan.Domain.Users;
using FinPlan.Infrastructure.Database;
using FinPlan.Infrastructure.Database.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FinPlan.Infrastructure;

public static class InfrastructureModule
{
    public static IServiceCollection RegisterApplicationInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.RegisterDatabase(configuration);
        services.RegisterRepositories();

        return services;
    }

    private static void RegisterDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        string connectionString = configuration.GetConnectionString("Database")
            ?? throw new InvalidOperationException("Missing 'Database' connection string.");

        services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
    }

    private static void RegisterRepositories(this IServiceCollection services)
    {
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<ITransactionCategoryRepository, TransactionCategoryRepository>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<ISavingGoalRepository, SavingGoalRepository>();
        services.AddScoped<IPocketRepository, PocketRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IActivityRepository, ActivityRepository>();
        services.AddScoped<IActivityExpenseRepository, ActivityExpenseRepository>();
        services.AddScoped<IGroupRepository, GroupRepository>();
    }
}
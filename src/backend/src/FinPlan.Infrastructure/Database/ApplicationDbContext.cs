using System.Reflection;
using FinPlan.Domain.Common;
using FinPlan.Domain.Transactions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace FinPlan.Infrastructure.Database;

public sealed class ApplicationDbContext : DbContext, IUnitOfWork
{
    public DbSet<TransactionCategory> TransactionCategories => Set<TransactionCategory>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        BumpUpdatedTimestamps();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default)
    {
        BumpUpdatedTimestamps();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    // Every modified entity (including soft-deletes, which set DeletedAt) gets
    // its UpdatedAt refreshed here, so callers never have to remember to do it.
    private void BumpUpdatedTimestamps()
    {
        foreach (EntityEntry<Entity> entry in ChangeTracker.Entries<Entity>())
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.Update();
        }
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);

        optionsBuilder.EnableDetailedErrors();
        optionsBuilder.EnableSensitiveDataLogging();
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<decimal>().HavePrecision(18, 2);
        configurationBuilder.Properties<string>().HaveMaxLength(4_000);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // All tables live under the dedicated 'finplan' schema rather than 'public'.
        // Migrations generated against this model create the schema automatically.
        modelBuilder.HasDefaultSchema("finplan");

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
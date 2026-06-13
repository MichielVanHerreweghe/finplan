using System.Reflection;
using FinPlan.Domain.Activities;
using FinPlan.Domain.Common;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using FinPlan.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata;

namespace FinPlan.Infrastructure.Database;

public sealed class ApplicationDbContext : DbContext, IUnitOfWork
{
    private readonly ICurrentOwnerProvider _ownerProvider;

    public DbSet<TransactionCategory> TransactionCategories => Set<TransactionCategory>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<SavingGoal> SavingGoals => Set<SavingGoal>();
    public DbSet<Pocket> Pockets => Set<Pocket>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Activity> Activities => Set<Activity>();
    public DbSet<ActivityExpense> ActivityExpenses => Set<ActivityExpense>();

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        ICurrentOwnerProvider ownerProvider) : base(options)
    {
        _ownerProvider = ownerProvider;
    }

    // The owner the current request's owned-entity reads are scoped to. Referencing this
    // instance member inside the query filter makes EF re-evaluate it per query, so each
    // scoped context (and each request) sees only its own user's data.
    public int CurrentOwnerId => _ownerProvider.CurrentOwnerId;

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        BumpUpdatedTimestamps();
        AssignOwnersToNewEntities();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default)
    {
        BumpUpdatedTimestamps();
        AssignOwnersToNewEntities();
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

    // New owned entities inherit the current request's owner exactly once. Handlers and
    // domain factories stay owner-agnostic; ownership is stamped centrally here so it can
    // never be forgotten. Persisting owned data without an authenticated user is a bug.
    private void AssignOwnersToNewEntities()
    {
        foreach (EntityEntry<OwnedEntity> entry in ChangeTracker.Entries<OwnedEntity>())
        {
            if (entry.State != EntityState.Added || entry.Entity.OwnerId != 0)
                continue;

            int ownerId = CurrentOwnerId;
            if (ownerId == 0)
                throw new InvalidOperationException(
                    "Cannot persist an owned entity without an authenticated user.");

            entry.Entity.AssignOwner(ownerId);
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

        // EntityConfiguration<T> already set a soft-delete-only filter on every entity.
        // For owned entities we replace it (EF keeps the last HasQueryFilter) with one that
        // also scopes by owner, so reads can never cross user boundaries.
        ApplyOwnerQueryFilters(modelBuilder);
    }

    private void ApplyOwnerQueryFilters(ModelBuilder modelBuilder)
    {
        MethodInfo setFilter = typeof(ApplicationDbContext)
            .GetMethod(nameof(SetOwnerQueryFilter), BindingFlags.Instance | BindingFlags.NonPublic)!;

        foreach (IMutableEntityType entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(IOwnedEntity).IsAssignableFrom(entityType.ClrType))
                setFilter.MakeGenericMethod(entityType.ClrType).Invoke(this, [modelBuilder]);
        }
    }

    private void SetOwnerQueryFilter<TEntity>(ModelBuilder modelBuilder)
        where TEntity : Entity, IOwnedEntity =>
        modelBuilder.Entity<TEntity>()
            .HasQueryFilter(entity => entity.DeletedAt == null && entity.OwnerId == CurrentOwnerId);
}

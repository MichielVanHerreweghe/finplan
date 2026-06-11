using FinPlan.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal class Repository<T> : IRepository<T> where T : Entity, IAggregateRoot
{
    protected readonly ApplicationDbContext Context;
    protected readonly DbSet<T> Set;

    public Repository(ApplicationDbContext context)
    {
        Context = context;
        Set = context.Set<T>();
    }

    public Task<T?> GetByIdAsync(int id, CancellationToken ct = default) =>
        Set.FirstOrDefaultAsync(entity => entity.Id == id, ct);

    public async Task<IReadOnlyList<T>> GetAsync(CancellationToken ct = default) =>
        await Set.ToListAsync(ct);

    public async Task AddAsync(T entity, CancellationToken ct = default) =>
        await Set.AddAsync(entity, ct);

    // Soft delete: flips DeletedAt on the tracked entity. The global query
    // filter then hides it from subsequent reads. Use Restore() to undo.
    public void Remove(T entity) => entity.Delete();
}

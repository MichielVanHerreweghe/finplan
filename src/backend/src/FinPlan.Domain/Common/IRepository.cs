namespace FinPlan.Domain.Common;

public interface IRepository<T> where T : Entity, IAggregateRoot
{
    public Task<T?> GetByIdAsync(int id, CancellationToken ct = default);
    public Task<IReadOnlyList<T>> GetAsync(CancellationToken ct = default);
    public Task AddAsync(T entity, CancellationToken ct = default);
    public void Remove(T entity);
}
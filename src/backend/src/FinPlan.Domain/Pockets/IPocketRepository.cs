using FinPlan.Domain.Common;

namespace FinPlan.Domain.Pockets;

public interface IPocketRepository : IRepository<Pocket>
{
    // Whether any pocket is nested under the given pocket; blocks deleting a parent.
    public Task<bool> HasChildrenAsync(int pocketId, CancellationToken ct = default);

    // Batch fetch for the GraphQL DataLoader resolving Transaction.fromPocket/toPocket
    // and for parent-existence checks: returns the pockets matching any of the given ids.
    public Task<IReadOnlyList<Pocket>> GetByIdsAsync(
        IReadOnlyList<int> ids, CancellationToken ct = default);
}

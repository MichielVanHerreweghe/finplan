using FinPlan.Domain.Common;

namespace FinPlan.Domain.Transactions;

public interface ITransactionCategoryRepository : IRepository<TransactionCategory>
{
    public Task<bool> ExistsWithNameAsync(string name, CancellationToken ct = default);
    public Task<TransactionCategory?> GetByNameAsync(string name, CancellationToken ct = default);

    // Batch fetch for the GraphQL DataLoader resolving Transaction.category:
    // returns the categories matching any of the given ids in one query.
    public Task<IReadOnlyList<TransactionCategory>> GetByIdsAsync(
        IReadOnlyList<int> ids, CancellationToken ct = default);
}
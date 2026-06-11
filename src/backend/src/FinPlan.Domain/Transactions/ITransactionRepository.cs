using FinPlan.Domain.Common;

namespace FinPlan.Domain.Transactions;

public interface ITransactionRepository : IRepository<Transaction>
{
    // Batch fetch for the GraphQL DataLoader resolving TransactionCategory.transactions:
    // returns every transaction belonging to any of the given category ids in one query.
    public Task<IReadOnlyList<Transaction>> GetByCategoryIdsAsync(
        IReadOnlyList<int> categoryIds, CancellationToken ct = default);
}
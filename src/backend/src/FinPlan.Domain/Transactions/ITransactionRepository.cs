using FinPlan.Domain.Common;

namespace FinPlan.Domain.Transactions;

public interface ITransactionRepository : IRepository<Transaction>
{
    // Batch fetch for the GraphQL DataLoader resolving TransactionCategory.transactions:
    // returns every transaction belonging to any of the given category ids in one query.
    public Task<IReadOnlyList<Transaction>> GetByCategoryIdsAsync(
        IReadOnlyList<int> categoryIds, CancellationToken ct = default);

    // Derived pocket balances: for each requested pocket, the sum of amounts moved in
    // (ToPocketId) minus amounts moved out (FromPocketId), across all transaction types.
    // Pockets with no transactions are returned with a zero balance.
    public Task<IReadOnlyDictionary<int, decimal>> GetBalancesByPocketIdsAsync(
        IReadOnlyCollection<int> pocketIds, CancellationToken ct = default);

    // Every transaction touching the pocket as either endpoint (in or out), for its detail view.
    public Task<IReadOnlyList<Transaction>> GetByPocketIdAsync(
        int pocketId, CancellationToken ct = default);

    // Per-goal saved amounts: the summed amount of transactions tagged to each goal.
    // Goals with no tagged transactions are returned with a zero total.
    public Task<IReadOnlyDictionary<int, decimal>> GetSavedAmountsByGoalIdsAsync(
        IReadOnlyCollection<int> goalIds, CancellationToken ct = default);

    // Every transaction tagged to the given saving goal (its contributions).
    public Task<IReadOnlyList<Transaction>> GetBySavingGoalIdAsync(
        int savingGoalId, CancellationToken ct = default);
}
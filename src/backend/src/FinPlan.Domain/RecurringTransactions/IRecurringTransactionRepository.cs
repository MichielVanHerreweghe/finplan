using FinPlan.Domain.Common;

namespace FinPlan.Domain.RecurringTransactions;

public interface IRecurringTransactionRepository : IRepository<RecurringTransaction>
{
    // Cross-owner discovery for the daily job: the distinct owner ids that have at least one
    // due definition (NextOccurrence on or before today). Bypasses the owner query filter, so
    // the implementation must re-apply the soft-delete predicate itself.
    Task<IReadOnlyList<int>> GetOwnerIdsWithDueAsync(DateOnly today, CancellationToken ct = default);

    // The current owner's due definitions (NextOccurrence on or before today). Owner-scoped via
    // the normal query filter — call it inside a per-owner scope.
    Task<IReadOnlyList<RecurringTransaction>> GetDueAsync(DateOnly today, CancellationToken ct = default);
}

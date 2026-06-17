using FinPlan.Domain.RecurringTransactions;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal sealed class RecurringTransactionRepository
    : Repository<RecurringTransaction>, IRecurringTransactionRepository
{
    public RecurringTransactionRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<int>> GetOwnerIdsWithDueAsync(
        DateOnly today, CancellationToken ct = default) =>
        // Cross-owner discovery: IgnoreQueryFilters drops BOTH the owner filter and the
        // soft-delete filter, so DeletedAt == null is re-applied explicitly here.
        await Set
            .IgnoreQueryFilters()
            .Where(r => r.DeletedAt == null && r.NextOccurrence != null && r.NextOccurrence <= today)
            .Select(r => r.OwnerId)
            .Distinct()
            .ToListAsync(ct);

    public async Task<IReadOnlyList<RecurringTransaction>> GetDueAsync(
        DateOnly today, CancellationToken ct = default) =>
        // Owner-scoped via the normal query filter; call inside a per-owner scope.
        await Set
            .Where(r => r.NextOccurrence != null && r.NextOccurrence <= today)
            .ToListAsync(ct);
}

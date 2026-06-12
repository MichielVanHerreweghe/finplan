using FinPlan.Domain.Transactions;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal sealed class TransactionRepository
    : Repository<Transaction>, ITransactionRepository
{
    public TransactionRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<Transaction>> GetByCategoryIdsAsync(
        IReadOnlyList<int> categoryIds, CancellationToken ct = default) =>
        await Set
            .Where(transaction => transaction.CategoryId != null
                && categoryIds.Contains(transaction.CategoryId.Value))
            .ToListAsync(ct);

    public async Task<IReadOnlyDictionary<int, decimal>> GetBalancesByPocketIdsAsync(
        IReadOnlyCollection<int> pocketIds, CancellationToken ct = default)
    {
        // Two grouped aggregates (one query each); the soft-delete query filter excludes
        // deleted transactions automatically. Combined in memory into a balance per pocket.
        Dictionary<int, decimal> balances = pocketIds.Distinct().ToDictionary(id => id, _ => 0m);

        List<PocketSum> incoming = await Set
            .Where(t => t.ToPocketId != null && pocketIds.Contains(t.ToPocketId.Value))
            .GroupBy(t => t.ToPocketId!.Value)
            .Select(g => new PocketSum(g.Key, g.Sum(t => t.Amount)))
            .ToListAsync(ct);

        List<PocketSum> outgoing = await Set
            .Where(t => t.FromPocketId != null && pocketIds.Contains(t.FromPocketId.Value))
            .GroupBy(t => t.FromPocketId!.Value)
            .Select(g => new PocketSum(g.Key, g.Sum(t => t.Amount)))
            .ToListAsync(ct);

        foreach (PocketSum row in incoming)
            balances[row.PocketId] += row.Sum;

        foreach (PocketSum row in outgoing)
            balances[row.PocketId] -= row.Sum;

        return balances;
    }

    public async Task<IReadOnlyList<Transaction>> GetByPocketIdAsync(
        int pocketId, CancellationToken ct = default) =>
        await Set
            .Where(transaction =>
                transaction.FromPocketId == pocketId || transaction.ToPocketId == pocketId)
            .OrderByDescending(transaction => transaction.Date)
            .ToListAsync(ct);

    public async Task<IReadOnlyDictionary<int, decimal>> GetSavedAmountsByGoalIdsAsync(
        IReadOnlyCollection<int> goalIds, CancellationToken ct = default)
    {
        Dictionary<int, decimal> totals = goalIds.Distinct().ToDictionary(id => id, _ => 0m);

        List<GoalSum> sums = await Set
            .Where(t => t.SavingGoalId != null && goalIds.Contains(t.SavingGoalId.Value))
            .GroupBy(t => t.SavingGoalId!.Value)
            .Select(g => new GoalSum(g.Key, g.Sum(t => t.Amount)))
            .ToListAsync(ct);

        foreach (GoalSum row in sums)
            totals[row.GoalId] = row.Sum;

        return totals;
    }

    public async Task<IReadOnlyList<Transaction>> GetBySavingGoalIdAsync(
        int savingGoalId, CancellationToken ct = default) =>
        await Set
            .Where(transaction => transaction.SavingGoalId == savingGoalId)
            .OrderByDescending(transaction => transaction.Date)
            .ToListAsync(ct);

    private sealed record PocketSum(int PocketId, decimal Sum);

    private sealed record GoalSum(int GoalId, decimal Sum);
}

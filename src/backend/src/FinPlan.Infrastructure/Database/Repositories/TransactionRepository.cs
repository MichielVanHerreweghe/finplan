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
}

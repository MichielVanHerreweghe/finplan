using FinPlan.Domain.Transactions;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal sealed class TransactionCategoryRepository
    : Repository<TransactionCategory>, ITransactionCategoryRepository
{
    public TransactionCategoryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public Task<bool> ExistsWithNameAsync(string name, CancellationToken ct = default) =>
        Set.AnyAsync(category => category.Name == name, ct);

    public Task<TransactionCategory?> GetByNameAsync(string name, CancellationToken ct = default) =>
        Set.FirstOrDefaultAsync(category => category.Name == name, ct);

    public async Task<IReadOnlyList<TransactionCategory>> GetByIdsAsync(
        IReadOnlyList<int> ids, CancellationToken ct = default) =>
        await Set.Where(category => ids.Contains(category.Id)).ToListAsync(ct);
}

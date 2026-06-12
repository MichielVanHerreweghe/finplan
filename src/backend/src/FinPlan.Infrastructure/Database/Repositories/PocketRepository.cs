using FinPlan.Domain.Pockets;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal sealed class PocketRepository
    : Repository<Pocket>, IPocketRepository
{
    public PocketRepository(ApplicationDbContext context) : base(context)
    {
    }

    public Task<bool> HasChildrenAsync(int pocketId, CancellationToken ct = default) =>
        Set.AnyAsync(pocket => pocket.ParentPocketId == pocketId, ct);

    public async Task<IReadOnlyList<Pocket>> GetByIdsAsync(
        IReadOnlyList<int> ids, CancellationToken ct = default) =>
        await Set.Where(pocket => ids.Contains(pocket.Id)).ToListAsync(ct);
}

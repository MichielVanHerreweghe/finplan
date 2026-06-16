using FinPlan.Domain.Groups;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal sealed class GroupRepository : Repository<Group>, IGroupRepository
{
    public GroupRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Groups have no owner query filter, so membership is the only thing scoping visibility.
    // Every read here MUST constrain by membership or it would leak other users' groups.
    public async Task<IReadOnlyList<Group>> GetForUserAsync(int userId, CancellationToken ct = default) =>
        await Set
            .Include(group => group.Members)
            .Where(group => group.Members.Any(member => member.UserId == userId))
            .OrderByDescending(group => group.Id)
            .ToListAsync(ct);

    public Task<Group?> GetByIdForUserAsync(int id, int userId, CancellationToken ct = default) =>
        Set
            .Include(group => group.Members)
            .FirstOrDefaultAsync(
                group => group.Id == id && group.Members.Any(member => member.UserId == userId), ct);

    public Task<bool> IsMemberOfOwnerAsync(int ownerId, int userId, CancellationToken ct = default) =>
        Set.AnyAsync(
            group => group.OwnerId == ownerId && group.Members.Any(member => member.UserId == userId), ct);

    public Task<Group?> GetByIdWithMembersAsync(int id, CancellationToken ct = default) =>
        Set
            .Include(group => group.Members)
            .FirstOrDefaultAsync(group => group.Id == id, ct);
}

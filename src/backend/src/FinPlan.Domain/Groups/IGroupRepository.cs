using FinPlan.Domain.Common;

namespace FinPlan.Domain.Groups;

public interface IGroupRepository : IRepository<Group>
{
    // Groups have no owner query filter, so visibility lives here: only groups the user belongs
    // to. Members are included so membership checks need no extra round-trip.
    Task<IReadOnlyList<Group>> GetForUserAsync(int userId, CancellationToken ct = default);

    Task<Group?> GetByIdForUserAsync(int id, int userId, CancellationToken ct = default);

    // Authorization for the active-context resolver: is the user a member of the group whose
    // data owner is ownerId? Queries unfiltered tables, safe before the effective owner is set.
    Task<bool> IsMemberOfOwnerAsync(int ownerId, int userId, CancellationToken ct = default);
}

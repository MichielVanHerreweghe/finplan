using FinPlan.Domain.Common;

namespace FinPlan.Domain.Activities;

public interface IActivityRepository : IRepository<Activity>
{
    // Activities are not owner-filtered, so visibility lives here: only return activities the user
    // is a member of. Both load Members so membership checks need no extra round-trip.
    Task<IReadOnlyList<Activity>> GetForUserAsync(int userId, CancellationToken ct = default);

    Task<Activity?> GetByIdForUserAsync(int id, int userId, CancellationToken ct = default);

    // Loads an activity with its members WITHOUT membership scoping — for accepting an invitation,
    // where the acting user is not (yet) a member.
    Task<Activity?> GetByIdWithMembersAsync(int id, CancellationToken ct = default);
}

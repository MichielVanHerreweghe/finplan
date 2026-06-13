using FinPlan.Domain.Activities;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal sealed class ActivityRepository : Repository<Activity>, IActivityRepository
{
    public ActivityRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Activities have no owner query filter, so membership is the only thing scoping visibility.
    // Every read here MUST constrain by membership or it would leak other users' activities.
    public async Task<IReadOnlyList<Activity>> GetForUserAsync(int userId, CancellationToken ct = default) =>
        await Set
            .Include(activity => activity.Members)
            .Where(activity => activity.Members.Any(member => member.UserId == userId))
            // Id is the identity column, so descending is newest-first. CreatedAt is not a
            // mapped column in this model, so it can't be used in a translated query.
            .OrderByDescending(activity => activity.Id)
            .ToListAsync(ct);

    public Task<Activity?> GetByIdForUserAsync(int id, int userId, CancellationToken ct = default) =>
        Set
            .Include(activity => activity.Members)
            .FirstOrDefaultAsync(
                activity => activity.Id == id && activity.Members.Any(member => member.UserId == userId), ct);
}

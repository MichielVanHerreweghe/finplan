using FinPlan.Domain.Common;

namespace FinPlan.Domain.SavingGoals;

// A pocket can back any number of goals; this only reports whether any exist,
// so deleting a pocket that still has goals attached can be blocked.
public interface ISavingGoalRepository : IRepository<SavingGoal>
{
    public Task<bool> ExistsForPocketAsync(int pocketId, CancellationToken ct = default);
}

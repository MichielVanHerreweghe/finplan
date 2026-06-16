using FinPlan.Domain.Common;

namespace FinPlan.Domain.Activities;

public interface IActivityExpenseRepository : IRepository<ActivityExpense>
{
    // Expenses for a activity, splits included, newest first. Callers must first confirm the
    // current user belongs to the activity (ActivityExpense carries no membership of its own).
    Task<IReadOnlyList<ActivityExpense>> GetByActivityAsync(int activityId, CancellationToken ct = default);
}

using FinPlan.Domain.Activities;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal sealed class ActivityExpenseRepository : Repository<ActivityExpense>, IActivityExpenseRepository
{
    public ActivityExpenseRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<ActivityExpense>> GetByActivityAsync(int activityId, CancellationToken ct = default) =>
        await Set
            .Include(expense => expense.Splits)
            .Where(expense => expense.ActivityId == activityId)
            .OrderByDescending(expense => expense.Date)
            .ToListAsync(ct);
}

using FinPlan.Domain.SavingGoals;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal sealed class SavingGoalRepository
    : Repository<SavingGoal>, ISavingGoalRepository
{
    public SavingGoalRepository(ApplicationDbContext context) : base(context)
    {
    }

    public Task<bool> ExistsForPocketAsync(int pocketId, CancellationToken ct = default) =>
        Set.AnyAsync(goal => goal.PocketId == pocketId, ct);
}

using FinPlan.Domain.SavingGoals;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal sealed class SavingGoalRepository
    : Repository<SavingGoal>, ISavingGoalRepository
{
    public SavingGoalRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<SavingGoal>> GetWithContributionsAsync(CancellationToken ct = default) =>
        await Set
            .Include(goal => goal.Contributions)
            .ToListAsync(ct);

    public Task<SavingGoal?> GetByIdWithContributionsAsync(int id, CancellationToken ct = default) =>
        Set
            .Include(goal => goal.Contributions)
            .FirstOrDefaultAsync(goal => goal.Id == id, ct);
}

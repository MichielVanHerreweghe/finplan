using FinPlan.Domain.Common;

namespace FinPlan.Domain.SavingGoals;

public interface ISavingGoalRepository : IRepository<SavingGoal>
{
    // The base repository does not eager-load navigations; these include the
    // contributions needed to compute saved/remaining amounts and the savings plan.
    public Task<IReadOnlyList<SavingGoal>> GetWithContributionsAsync(CancellationToken ct = default);

    public Task<SavingGoal?> GetByIdWithContributionsAsync(int id, CancellationToken ct = default);
}

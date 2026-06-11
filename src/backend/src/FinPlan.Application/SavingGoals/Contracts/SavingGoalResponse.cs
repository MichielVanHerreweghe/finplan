using FinPlan.Domain.SavingGoals;

namespace FinPlan.Application.SavingGoals.Contracts;

public sealed record SavingGoalResponse(
    int Id,
    string Name,
    string? Description,
    decimal TargetAmount,
    DateOnly? Deadline,
    decimal SavedAmount,
    decimal RemainingAmount,
    bool IsCompleted,
    decimal? RequiredMonthly,
    decimal? RequiredWeekly,
    bool IsOverdue,
    IReadOnlyList<SavingGoalContributionResponse> Contributions);

public sealed record SavingGoalContributionResponse(int Id, decimal Amount, DateOnly Date);

internal static class SavingGoalMapping
{
    public static SavingGoalResponse ToResponse(this SavingGoal goal, DateOnly today)
    {
        SavingsContributionPlan? plan = goal.RequiredContributions(today);

        IReadOnlyList<SavingGoalContributionResponse> contributions = goal.Contributions
            .Select(contribution => new SavingGoalContributionResponse(
                contribution.Id, contribution.Amount, contribution.Date))
            .ToList();

        return new SavingGoalResponse(
            goal.Id,
            goal.Name,
            goal.Description,
            goal.TargetAmount,
            goal.Deadline,
            goal.SavedAmount,
            goal.RemainingAmount,
            goal.IsCompleted,
            plan?.PerMonth,
            plan?.PerWeek,
            plan?.IsOverdue ?? false,
            contributions);
    }
}

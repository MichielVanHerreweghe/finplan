using FinPlan.Domain.SavingGoals;

namespace FinPlan.Application.SavingGoals.Contracts;

public sealed record SavingGoalResponse(
    int Id,
    string Name,
    string? Description,
    decimal TargetAmount,
    DateOnly? Deadline,
    int PocketId,
    decimal SavedAmount,
    decimal RemainingAmount,
    bool IsCompleted,
    decimal? RequiredMonthly,
    decimal? RequiredWeekly,
    bool IsOverdue);

internal static class SavingGoalMapping
{
    // Progress is the linked pocket's balance (savedAmount), supplied by the query handler.
    public static SavingGoalResponse ToResponse(this SavingGoal goal, DateOnly today, decimal savedAmount)
    {
        SavingsContributionPlan? plan = goal.RequiredContributions(today, savedAmount);

        decimal remaining = Math.Max(0, goal.TargetAmount - savedAmount);
        bool isCompleted = savedAmount >= goal.TargetAmount;

        return new SavingGoalResponse(
            goal.Id,
            goal.Name,
            goal.Description,
            goal.TargetAmount,
            goal.Deadline,
            goal.PocketId,
            savedAmount,
            remaining,
            isCompleted,
            plan?.PerMonth,
            plan?.PerWeek,
            plan?.IsOverdue ?? false);
    }
}

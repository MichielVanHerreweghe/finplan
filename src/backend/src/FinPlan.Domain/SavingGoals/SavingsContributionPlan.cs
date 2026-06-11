namespace FinPlan.Domain.SavingGoals;

// The optimal amount to set aside to reach a goal by its deadline.
// PerMonth/PerWeek are rounded up to the cent so following the plan never under-saves.
public sealed record SavingsContributionPlan(decimal PerMonth, decimal PerWeek, bool IsOverdue);

namespace FinPlan.Application.SavingGoals.Queries.GetSavingGoals;

/// <summary>Status filter for saving-goal lists (derived from computed progress).</summary>
public enum SavingGoalStatus
{
    All = 0,
    Active,
    Completed,
    Overdue,
}

/// <summary>Server-side ordering options for saving-goal lists.</summary>
public enum SavingGoalSort
{
    NameAsc = 0,
    DeadlineAsc,
    ProgressDesc,
    TargetDesc,
    RemainingAsc,
}

using FinPlan.Domain.Common;
using FluentResults;

namespace FinPlan.Domain.SavingGoals;

public sealed class SavingGoal : Entity, IAggregateRoot
{
    // Average days per month (365.25 / 12); used to translate a deadline into whole months.
    private const double DaysPerMonth = 30.436875;

    private readonly List<SavingGoalContribution> _contributions = [];

    public string Name { get; private set; }
    public string? Description { get; private set; }
    public decimal TargetAmount { get; private set; }
    public DateOnly? Deadline { get; private set; }

    public IReadOnlyList<SavingGoalContribution> Contributions => _contributions;

    public decimal SavedAmount => _contributions.Sum(contribution => contribution.Amount);
    public decimal RemainingAmount => Math.Max(0, TargetAmount - SavedAmount);
    public bool IsCompleted => SavedAmount >= TargetAmount;

    private SavingGoal(string name, string? description, decimal targetAmount, DateOnly? deadline)
    {
        Name = name;
        Description = description;
        TargetAmount = targetAmount;
        Deadline = deadline;
    }

    public static Result<SavingGoal> Create(string name, string? description, decimal targetAmount, DateOnly? deadline)
    {
        Result validationResult = Validate(name, targetAmount);

        if (validationResult.IsFailed)
            return validationResult;

        return new SavingGoal(name, description, targetAmount, deadline);
    }

    public Result Update(string name, string? description, decimal targetAmount, DateOnly? deadline)
    {
        Result validationResult = Validate(name, targetAmount);

        if (validationResult.IsFailed)
            return validationResult;

        Name = name;
        Description = description;
        TargetAmount = targetAmount;
        Deadline = deadline;

        return Result.Ok();
    }

    public Result AddContribution(decimal amount, DateOnly date)
    {
        if (amount <= 0)
            return Result.Fail("Contribution amount must be greater than zero.");

        _contributions.Add(SavingGoalContribution.Create(amount, date));

        return Result.Ok();
    }

    public Result RemoveContribution(int contributionId)
    {
        SavingGoalContribution? contribution =
            _contributions.FirstOrDefault(c => c.Id == contributionId);

        if (contribution is null)
            return Result.Fail($"Contribution {contributionId} does not exist on this goal.");

        _contributions.Remove(contribution);

        return Result.Ok();
    }

    // The optimal contribution to reach the target by the deadline, relative to `today`.
    // Returns null when the goal has no deadline (no schedule to derive).
    public SavingsContributionPlan? RequiredContributions(DateOnly today)
    {
        if (Deadline is not { } deadline)
            return null;

        decimal remaining = RemainingAmount;
        int daysRemaining = deadline.DayNumber - today.DayNumber;
        bool isOverdue = remaining > 0 && daysRemaining < 0;

        if (remaining == 0)
            return new SavingsContributionPlan(0, 0, false);

        // Deadline reached or passed but money still owed: it's all needed now.
        if (daysRemaining <= 0)
            return new SavingsContributionPlan(remaining, remaining, isOverdue);

        double weeks = Math.Ceiling(daysRemaining / 7.0);
        double months = Math.Ceiling(daysRemaining / DaysPerMonth);

        decimal perWeek = CeilCents(remaining / (decimal)weeks);
        decimal perMonth = CeilCents(remaining / (decimal)months);

        return new SavingsContributionPlan(perMonth, perWeek, false);
    }

    private static decimal CeilCents(decimal amount) => Math.Ceiling(amount * 100m) / 100m;

    private static Result Validate(string name, decimal targetAmount)
    {
        Result result = new();

        if (string.IsNullOrWhiteSpace(name))
            result.WithError("Name cannot be empty.");

        if (targetAmount <= 0)
            result.WithError("Target amount must be greater than zero.");

        return result;
    }
}

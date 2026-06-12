using FinPlan.Domain.Common;
using FluentResults;

namespace FinPlan.Domain.SavingGoals;

public sealed class SavingGoal : Entity, IAggregateRoot
{
    // Average days per month (365.25 / 12); used to translate a deadline into whole months.
    private const double DaysPerMonth = 30.436875;

    public string Name { get; private set; }
    public string? Description { get; private set; }
    public decimal TargetAmount { get; private set; }
    public DateOnly? Deadline { get; private set; }

    // A goal is a target/deadline overlay on exactly one pocket (1:1). Progress is
    // not stored here: it is the linked pocket's balance, computed on the read side.
    public int PocketId { get; private set; }

    private SavingGoal(string name, string? description, decimal targetAmount, DateOnly? deadline, int pocketId)
    {
        Name = name;
        Description = description;
        TargetAmount = targetAmount;
        Deadline = deadline;
        PocketId = pocketId;
    }

    public static Result<SavingGoal> Create(string name, string? description, decimal targetAmount, DateOnly? deadline, int pocketId)
    {
        Result validationResult = Validate(name, targetAmount, pocketId);

        if (validationResult.IsFailed)
            return validationResult;

        return new SavingGoal(name, description, targetAmount, deadline, pocketId);
    }

    public Result Update(string name, string? description, decimal targetAmount, DateOnly? deadline, int pocketId)
    {
        Result validationResult = Validate(name, targetAmount, pocketId);

        if (validationResult.IsFailed)
            return validationResult;

        Name = name;
        Description = description;
        TargetAmount = targetAmount;
        Deadline = deadline;
        PocketId = pocketId;

        return Result.Ok();
    }

    // The optimal contribution to reach the target by the deadline, relative to `today`,
    // given how much is already saved in the linked pocket.
    // Returns null when the goal has no deadline (no schedule to derive).
    public SavingsContributionPlan? RequiredContributions(DateOnly today, decimal savedAmount)
    {
        if (Deadline is not { } deadline)
            return null;

        decimal remaining = Math.Max(0, TargetAmount - savedAmount);
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

    private static Result Validate(string name, decimal targetAmount, int pocketId)
    {
        Result result = new();

        if (string.IsNullOrWhiteSpace(name))
            result.WithError("Name cannot be empty.");

        if (targetAmount <= 0)
            result.WithError("Target amount must be greater than zero.");

        if (pocketId <= 0)
            result.WithError("A saving goal must be linked to a pocket.");

        return result;
    }
}

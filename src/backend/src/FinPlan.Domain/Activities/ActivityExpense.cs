using FinPlan.Domain.Common;
using FinPlan.Domain.Splitting;
using FluentResults;

namespace FinPlan.Domain.Activities;

// A shared expense within a activity: who paid, how much, and how it is split among members.
// Like Activity, NOT an OwnedEntity — it is visible to the whole activity, scoped by membership.
// The split is resolved into concrete per-member amounts here so client math is never trusted.
public sealed class ActivityExpense : Entity, IAggregateRoot
{
    private readonly List<ActivityExpenseSplit> _splits = [];

    public int ActivityId { get; private set; }
    public string Description { get; private set; }
    public DateOnly Date { get; private set; }
    public decimal Amount { get; private set; }
    public int PaidByUserId { get; private set; }
    public SplitType SplitType { get; private set; }

    public IReadOnlyCollection<ActivityExpenseSplit> Splits => _splits.AsReadOnly();

    private ActivityExpense(
        int activityId, string description, DateOnly date, decimal amount, int paidByUserId, SplitType splitType)
    {
        ActivityId = activityId;
        Description = description;
        Date = date;
        Amount = amount;
        PaidByUserId = paidByUserId;
        SplitType = splitType;
    }

    public static Result<ActivityExpense> Create(
        int activityId,
        string description,
        DateOnly date,
        decimal amount,
        int paidByUserId,
        SplitType splitType,
        IReadOnlyList<SplitParticipant> participants)
    {
        Result validationResult = Validate(activityId, description, amount, paidByUserId, splitType);

        if (validationResult.IsFailed)
            return validationResult;

        Result<IReadOnlyList<ResolvedSplit>> splits = ExpenseSplitCalculator.Build(amount, splitType, participants);

        if (splits.IsFailed)
            return splits.ToResult();

        ActivityExpense expense = new(activityId, description, date, amount, paidByUserId, splitType);
        expense._splits.AddRange(splits.Value
            .Select(split => new ActivityExpenseSplit(split.UserId, split.Amount, split.Percentage)));

        return expense;
    }

    // Expense-level checks. The split intent (participants, amounts, percentages) is validated by
    // ExpenseSplitCalculator, the single authority on split math.
    private static Result Validate(
        int activityId,
        string description,
        decimal amount,
        int paidByUserId,
        SplitType splitType)
    {
        Result result = new();

        if (activityId <= 0)
            result.WithError("Invalid activity id.");

        if (string.IsNullOrWhiteSpace(description))
            result.WithError("Description cannot be empty.");

        if (amount <= 0)
            result.WithError("Amount must be greater than zero.");

        if (paidByUserId <= 0)
            result.WithError("Invalid payer id.");

        if (splitType == SplitType.Undefined)
            result.WithError("SplitType cannot be undefined.");

        return result;
    }
}

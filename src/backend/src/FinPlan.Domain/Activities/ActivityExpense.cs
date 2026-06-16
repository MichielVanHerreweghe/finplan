using FinPlan.Domain.Common;
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
        Result validationResult = Validate(activityId, description, amount, paidByUserId, splitType, participants);

        if (validationResult.IsFailed)
            return validationResult;

        Result<List<ActivityExpenseSplit>> splits = BuildSplits(amount, splitType, participants);

        if (splits.IsFailed)
            return splits.ToResult();

        ActivityExpense expense = new(activityId, description, date, amount, paidByUserId, splitType);
        expense._splits.AddRange(splits.Value);

        return expense;
    }

    private static Result Validate(
        int activityId,
        string description,
        decimal amount,
        int paidByUserId,
        SplitType splitType,
        IReadOnlyList<SplitParticipant> participants)
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

        if (participants.Count == 0)
            result.WithError("A split needs at least one participant.");

        if (participants.Any(participant => participant.UserId <= 0))
            result.WithError("Invalid participant id.");

        if (participants.Select(participant => participant.UserId).Distinct().Count() != participants.Count)
            result.WithError("A participant cannot appear more than once in a split.");

        return result;
    }

    // Resolves the split intent into concrete owed amounts that always sum exactly to Amount.
    // Works in integer cents so rounding never leaks or invents a cent.
    private static Result<List<ActivityExpenseSplit>> BuildSplits(
        decimal amount, SplitType splitType, IReadOnlyList<SplitParticipant> participants) =>
        splitType switch
        {
            SplitType.Equal => SplitEqually(amount, participants),
            SplitType.Exact => SplitExactly(amount, participants),
            SplitType.Percentage => SplitByPercentage(amount, participants),
            _ => Result.Fail("Unsupported split type."),
        };

    private static Result<List<ActivityExpenseSplit>> SplitEqually(
        decimal amount, IReadOnlyList<SplitParticipant> participants)
    {
        long totalCents = Cents(amount);
        int count = participants.Count;
        long baseShare = totalCents / count;
        long remainder = totalCents - (baseShare * count);

        List<ActivityExpenseSplit> splits = [];
        for (int i = 0; i < count; i++)
        {
            long share = baseShare + (i < remainder ? 1 : 0);
            splits.Add(new ActivityExpenseSplit(participants[i].UserId, FromCents(share), null));
        }

        return splits;
    }

    private static Result<List<ActivityExpenseSplit>> SplitExactly(
        decimal amount, IReadOnlyList<SplitParticipant> participants)
    {
        if (participants.Any(participant => participant.ExactAmount is null or <= 0))
            return Result.Fail("Each participant needs a positive amount for an exact split.");

        long assigned = participants.Sum(participant => Cents(participant.ExactAmount!.Value));
        if (assigned != Cents(amount))
            return Result.Fail("The split amounts must add up to the total.");

        List<ActivityExpenseSplit> splits = participants
            .Select(participant => new ActivityExpenseSplit(participant.UserId, participant.ExactAmount!.Value, null))
            .ToList();

        return splits;
    }

    private static Result<List<ActivityExpenseSplit>> SplitByPercentage(
        decimal amount, IReadOnlyList<SplitParticipant> participants)
    {
        if (participants.Any(participant => participant.Percentage is null or <= 0))
            return Result.Fail("Each participant needs a positive percentage.");

        if (participants.Sum(participant => participant.Percentage!.Value) != 100m)
            return Result.Fail("The percentages must add up to 100.");

        long totalCents = Cents(amount);

        // Floor every share first, then hand the leftover cents (always fewer than the
        // participant count) out one each from the top so the shares sum exactly to the total.
        long[] shares = participants
            .Select(participant => (long)Math.Floor(totalCents * participant.Percentage!.Value / 100m))
            .ToArray();
        long leftover = totalCents - shares.Sum();

        List<ActivityExpenseSplit> splits = [];
        for (int i = 0; i < participants.Count; i++)
        {
            long share = shares[i] + (i < leftover ? 1 : 0);
            splits.Add(new ActivityExpenseSplit(participants[i].UserId, FromCents(share), participants[i].Percentage));
        }

        return splits;
    }

    private static long Cents(decimal value) => (long)Math.Round(value * 100m, MidpointRounding.AwayFromZero);

    private static decimal FromCents(long cents) => cents / 100m;
}

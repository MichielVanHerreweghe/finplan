using FluentResults;

namespace FinPlan.Domain.Splitting;

// Resolves a split intent into concrete owed amounts that always sum exactly to the total.
// Works in integer cents so rounding never leaks or invents a cent. Shared by every feature that
// splits money (activities, contact ledgers) so the math lives in exactly one place.
public static class ExpenseSplitCalculator
{
    public static Result<IReadOnlyList<ResolvedSplit>> Build(
        decimal amount, SplitType splitType, IReadOnlyList<SplitParticipant> participants)
    {
        Result validation = ValidateParticipants(participants);

        if (validation.IsFailed)
            return validation;

        return splitType switch
        {
            SplitType.Equal => SplitEqually(amount, participants),
            SplitType.Exact => SplitExactly(amount, participants),
            SplitType.Percentage => SplitByPercentage(amount, participants),
            _ => Result.Fail("Unsupported split type."),
        };
    }

    private static Result ValidateParticipants(IReadOnlyList<SplitParticipant> participants)
    {
        Result result = new();

        if (participants.Count == 0)
            result.WithError("A split needs at least one participant.");

        if (participants.Any(participant => participant.UserId <= 0))
            result.WithError("Invalid participant id.");

        if (participants.Select(participant => participant.UserId).Distinct().Count() != participants.Count)
            result.WithError("A participant cannot appear more than once in a split.");

        return result;
    }

    private static Result<IReadOnlyList<ResolvedSplit>> SplitEqually(
        decimal amount, IReadOnlyList<SplitParticipant> participants)
    {
        long totalCents = Cents(amount);
        int count = participants.Count;
        long baseShare = totalCents / count;
        long remainder = totalCents - (baseShare * count);

        List<ResolvedSplit> splits = [];
        for (int i = 0; i < count; i++)
        {
            long share = baseShare + (i < remainder ? 1 : 0);
            splits.Add(new ResolvedSplit(participants[i].UserId, FromCents(share), null));
        }

        return Result.Ok<IReadOnlyList<ResolvedSplit>>(splits);
    }

    private static Result<IReadOnlyList<ResolvedSplit>> SplitExactly(
        decimal amount, IReadOnlyList<SplitParticipant> participants)
    {
        if (participants.Any(participant => participant.ExactAmount is null or <= 0))
            return Result.Fail("Each participant needs a positive amount for an exact split.");

        long assigned = participants.Sum(participant => Cents(participant.ExactAmount!.Value));
        if (assigned != Cents(amount))
            return Result.Fail("The split amounts must add up to the total.");

        List<ResolvedSplit> splits = participants
            .Select(participant => new ResolvedSplit(participant.UserId, participant.ExactAmount!.Value, null))
            .ToList();

        return Result.Ok<IReadOnlyList<ResolvedSplit>>(splits);
    }

    private static Result<IReadOnlyList<ResolvedSplit>> SplitByPercentage(
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

        List<ResolvedSplit> splits = [];
        for (int i = 0; i < participants.Count; i++)
        {
            long share = shares[i] + (i < leftover ? 1 : 0);
            splits.Add(new ResolvedSplit(participants[i].UserId, FromCents(share), participants[i].Percentage));
        }

        return Result.Ok<IReadOnlyList<ResolvedSplit>>(splits);
    }

    private static long Cents(decimal value) => (long)Math.Round(value * 100m, MidpointRounding.AwayFromZero);

    private static decimal FromCents(long cents) => cents / 100m;
}

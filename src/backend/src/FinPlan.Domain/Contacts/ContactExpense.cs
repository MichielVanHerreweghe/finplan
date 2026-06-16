using FinPlan.Domain.Common;
using FinPlan.Domain.Splitting;
using FluentResults;

namespace FinPlan.Domain.Contacts;

// A shared expense between two users — the building block of a one-on-one ("friend") ledger,
// the Splitwise equivalent for Contacts. Keyed on the canonical user pair so both people see it.
// NOT an OwnedEntity: visibility is scoped by "the current user is one of the pair", like Activity.
// The split is resolved into concrete per-user amounts here (via the shared calculator) so client
// math is never trusted.
public sealed class ContactExpense : Entity, IAggregateRoot
{
    private readonly List<ContactExpenseSplit> _splits = [];

    public int UserAId { get; private set; }
    public int UserBId { get; private set; }
    public string Description { get; private set; }
    public DateOnly Date { get; private set; }
    public decimal Amount { get; private set; }
    public int PaidByUserId { get; private set; }
    public SplitType SplitType { get; private set; }

    public IReadOnlyCollection<ContactExpenseSplit> Splits => _splits.AsReadOnly();

    private ContactExpense(
        int userAId, int userBId, string description, DateOnly date, decimal amount,
        int paidByUserId, SplitType splitType)
    {
        UserAId = userAId;
        UserBId = userBId;
        Description = description;
        Date = date;
        Amount = amount;
        PaidByUserId = paidByUserId;
        SplitType = splitType;
    }

    public static Result<ContactExpense> Create(
        int currentUserId,
        int otherUserId,
        string description,
        DateOnly date,
        decimal amount,
        int paidByUserId,
        SplitType splitType,
        IReadOnlyList<SplitParticipant> participants)
    {
        ContactPair pair = ContactPair.Of(currentUserId, otherUserId);

        Result validationResult = Validate(pair, description, amount, paidByUserId, splitType, participants);

        if (validationResult.IsFailed)
            return validationResult;

        Result<IReadOnlyList<ResolvedSplit>> splits = ExpenseSplitCalculator.Build(amount, splitType, participants);

        if (splits.IsFailed)
            return splits.ToResult();

        ContactExpense expense = new(pair.A, pair.B, description, date, amount, paidByUserId, splitType);
        expense._splits.AddRange(splits.Value
            .Select(split => new ContactExpenseSplit(split.UserId, split.Amount, split.Percentage)));

        return expense;
    }

    private static Result Validate(
        ContactPair pair,
        string description,
        decimal amount,
        int paidByUserId,
        SplitType splitType,
        IReadOnlyList<SplitParticipant> participants)
    {
        Result result = new();

        if (!pair.IsValid)
            result.WithError("A contact expense needs two different users.");

        if (string.IsNullOrWhiteSpace(description))
            result.WithError("Description cannot be empty.");

        if (amount <= 0)
            result.WithError("Amount must be greater than zero.");

        if (!pair.Contains(paidByUserId))
            result.WithError("The payer must be one of the two people.");

        if (splitType == SplitType.Undefined)
            result.WithError("SplitType cannot be undefined.");

        if (participants.Any(participant => !pair.Contains(participant.UserId)))
            result.WithError("Everyone in the split must be one of the two people.");

        return result;
    }
}

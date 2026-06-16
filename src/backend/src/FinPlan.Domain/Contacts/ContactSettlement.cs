using FinPlan.Domain.Common;
using FluentResults;

namespace FinPlan.Domain.Contacts;

// A recorded payment that settles part of a one-on-one balance: FromUserId paid ToUserId. Keyed on
// the canonical user pair, like ContactExpense, so both people see it. Paying down a debt moves the
// balance toward zero (see the balance accumulation in the application layer).
public sealed class ContactSettlement : Entity, IAggregateRoot
{
    public int UserAId { get; private set; }
    public int UserBId { get; private set; }
    public int FromUserId { get; private set; }
    public int ToUserId { get; private set; }
    public decimal Amount { get; private set; }
    public DateOnly Date { get; private set; }

    private ContactSettlement(
        int userAId, int userBId, int fromUserId, int toUserId, decimal amount, DateOnly date)
    {
        UserAId = userAId;
        UserBId = userBId;
        FromUserId = fromUserId;
        ToUserId = toUserId;
        Amount = amount;
        Date = date;
    }

    public static Result<ContactSettlement> Create(
        int currentUserId, int otherUserId, int fromUserId, int toUserId, decimal amount, DateOnly date)
    {
        ContactPair pair = ContactPair.Of(currentUserId, otherUserId);

        Result validationResult = Validate(pair, fromUserId, toUserId, amount);

        if (validationResult.IsFailed)
            return validationResult;

        return new ContactSettlement(pair.A, pair.B, fromUserId, toUserId, amount, date);
    }

    private static Result Validate(ContactPair pair, int fromUserId, int toUserId, decimal amount)
    {
        Result result = new();

        if (!pair.IsValid)
            result.WithError("A settlement needs two different users.");

        if (amount <= 0)
            result.WithError("Amount must be greater than zero.");

        if (!pair.Contains(fromUserId) || !pair.Contains(toUserId))
            result.WithError("The payer and recipient must be the two people in the ledger.");

        if (fromUserId == toUserId)
            result.WithError("A settlement cannot be from and to the same person.");

        return result;
    }
}

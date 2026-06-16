using FinPlan.Domain.Contacts;

namespace FinPlan.Application.Contacts.Queries;

// Computes a user's one-on-one net balance against each counterparty across the ledger. Mirrors
// ActivityBalances: a payer is credited the amount paid; each split debits the owed share; a
// settlement payment moves the balance toward zero (the payer is credited, the recipient debited).
// Positive net => the counterparty owes the user; negative => the user owes the counterparty.
internal static class ContactBalance
{
    public static IReadOnlyDictionary<int, decimal> NetByCounterparty(
        int userId,
        IEnumerable<ContactExpense> expenses,
        IEnumerable<ContactSettlement> settlements)
    {
        Dictionary<int, decimal> net = [];

        foreach (ContactExpense expense in expenses)
        {
            int other = expense.UserAId == userId ? expense.UserBId : expense.UserAId;
            net.TryAdd(other, 0m);

            if (expense.PaidByUserId == userId)
                net[other] += expense.Amount;

            foreach (ContactExpenseSplit split in expense.Splits)
            {
                if (split.UserId == userId)
                    net[other] -= split.Amount;
            }
        }

        foreach (ContactSettlement settlement in settlements)
        {
            int other = settlement.UserAId == userId ? settlement.UserBId : settlement.UserAId;
            net.TryAdd(other, 0m);

            if (settlement.FromUserId == userId)
                net[other] += settlement.Amount;

            if (settlement.ToUserId == userId)
                net[other] -= settlement.Amount;
        }

        return net;
    }
}

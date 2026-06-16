namespace FinPlan.Domain.Activities;

// A single transfer that settles part of the debt: FromUserId pays ToUserId the given amount.
public sealed record Settlement(int FromUserId, int ToUserId, decimal Amount);

// Turns a set of net balances into the concrete "who pays whom" transfers needed to settle up.
//
// We greedily match the largest creditor with the largest debtor and transfer the smaller of the
// two each step, which clears at least one party per transfer. That bounds the result at (n - 1)
// transfers for n people with non-zero balances — far fewer than the naive "everyone pays the
// payer back" approach, which is exactly what makes settling cheap. (The theoretically minimal
// count is NP-hard to guarantee; this greedy heuristic is the standard, near-optimal approach.)
public static class DebtSettlement
{
    public static IReadOnlyList<Settlement> Settle(IReadOnlyDictionary<int, decimal> netBalances)
    {
        // Max-heaps keyed by the magnitude owed/due (PriorityQueue is a min-heap, so we negate).
        // The running amount rides along in the element so a partially-settled party can be
        // re-enqueued with its remainder.
        PriorityQueue<(int UserId, decimal Amount), decimal> creditors = new();
        PriorityQueue<(int UserId, decimal Amount), decimal> debtors = new();

        foreach ((int userId, decimal net) in netBalances)
        {
            if (net > 0)
                creditors.Enqueue((userId, net), -net);
            else if (net < 0)
                debtors.Enqueue((userId, -net), net);
        }

        List<Settlement> settlements = [];

        while (creditors.Count > 0 && debtors.Count > 0)
        {
            (int creditorId, decimal credit) = creditors.Dequeue();
            (int debtorId, decimal debt) = debtors.Dequeue();

            decimal amount = Math.Min(credit, debt);
            settlements.Add(new Settlement(debtorId, creditorId, amount));

            decimal creditLeft = credit - amount;
            decimal debtLeft = debt - amount;

            if (creditLeft > 0)
                creditors.Enqueue((creditorId, creditLeft), -creditLeft);
            if (debtLeft > 0)
                debtors.Enqueue((debtorId, debtLeft), -debtLeft);
        }

        return settlements;
    }
}

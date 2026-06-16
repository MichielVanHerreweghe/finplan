using FinPlan.Application.Activities.Contracts;
using FinPlan.Domain.Activities;

namespace FinPlan.Application.Activities.Queries;

internal static class ActivityBalances
{
    // Each member's net position: what they paid for the activity minus what they owe across all
    // its expenses. Positive => the activity owes them; negative => they owe the activity. Computed
    // over current members only (a removed member's residual balance is dropped).
    public static IReadOnlyList<ActivityBalanceResponse> Compute(
        Activity activity, IReadOnlyList<ActivityExpense> expenses)
    {
        Dictionary<int, decimal> net = activity.Members.ToDictionary(member => member.UserId, _ => 0m);

        foreach (ActivityExpense expense in expenses)
        {
            if (net.ContainsKey(expense.PaidByUserId))
                net[expense.PaidByUserId] += expense.Amount;

            foreach (ActivityExpenseSplit split in expense.Splits)
            {
                if (net.ContainsKey(split.UserId))
                    net[split.UserId] -= split.Amount;
            }
        }

        return net
            .Select(entry => new ActivityBalanceResponse(entry.Key, entry.Value))
            .ToList();
    }
}

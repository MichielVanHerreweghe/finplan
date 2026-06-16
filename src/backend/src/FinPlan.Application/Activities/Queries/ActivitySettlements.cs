using FinPlan.Application.Activities.Contracts;
using FinPlan.Domain.Activities;

namespace FinPlan.Application.Activities.Queries;

internal static class ActivitySettlements
{
    // Derives the minimal set of "who pays whom" transfers from the members' net balances using the
    // domain settlement algorithm, then maps it onto the API contract.
    public static IReadOnlyList<ActivitySettlementResponse> Compute(
        IReadOnlyList<ActivityBalanceResponse> balances)
    {
        Dictionary<int, decimal> net = balances.ToDictionary(balance => balance.UserId, balance => balance.Net);

        return DebtSettlement.Settle(net)
            .Select(settlement => new ActivitySettlementResponse(
                settlement.FromUserId, settlement.ToUserId, settlement.Amount))
            .ToList();
    }
}

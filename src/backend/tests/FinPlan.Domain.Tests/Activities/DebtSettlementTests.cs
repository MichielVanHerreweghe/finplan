using FinPlan.Domain.Activities;
using Xunit;

namespace FinPlan.Domain.Tests.Activities;

public class DebtSettlementTests
{
    [Fact]
    public void Settle_TwoPeople_ProducesSingleTransfer()
    {
        // User 1 is owed 50, user 2 owes 50.
        var net = new Dictionary<int, decimal> { [1] = 50m, [2] = -50m };

        IReadOnlyList<Settlement> settlements = DebtSettlement.Settle(net);

        Settlement transfer = Assert.Single(settlements);
        Assert.Equal(2, transfer.FromUserId);
        Assert.Equal(1, transfer.ToUserId);
        Assert.Equal(50m, transfer.Amount);
    }

    [Fact]
    public void Settle_AllSquare_ProducesNoTransfers()
    {
        var net = new Dictionary<int, decimal> { [1] = 0m, [2] = 0m, [3] = 0m };

        Assert.Empty(DebtSettlement.Settle(net));
    }

    [Fact]
    public void Settle_MinimisesTransferCount()
    {
        // Two debtors (-30, -30) and two creditors (+40, +20). The naive "pay everyone back"
        // scheme needs up to four transfers; the minimal settlement needs only three.
        var net = new Dictionary<int, decimal>
        {
            [1] = 40m,
            [2] = 20m,
            [3] = -30m,
            [4] = -30m,
        };

        IReadOnlyList<Settlement> settlements = DebtSettlement.Settle(net);

        Assert.Equal(3, settlements.Count);
        AssertConserved(net, settlements);
    }

    [Fact]
    public void Settle_NeverExceedsParticipantsMinusOneTransfers()
    {
        var net = new Dictionary<int, decimal>
        {
            [1] = 100m,
            [2] = -10m,
            [3] = -20m,
            [4] = -30m,
            [5] = -40m,
        };

        IReadOnlyList<Settlement> settlements = DebtSettlement.Settle(net);

        Assert.True(settlements.Count <= net.Count - 1);
        AssertConserved(net, settlements);
    }

    [Fact]
    public void Settle_LargestCreditorAndDebtorClearInOneStep()
    {
        var net = new Dictionary<int, decimal> { [1] = 60m, [2] = -100m, [3] = 40m };

        IReadOnlyList<Settlement> settlements = DebtSettlement.Settle(net);

        // Debtor 2 covers both creditors, so exactly two transfers, both flowing from user 2.
        Assert.Equal(2, settlements.Count);
        Assert.All(settlements, settlement => Assert.Equal(2, settlement.FromUserId));
        AssertConserved(net, settlements);
    }

    [Fact]
    public void Settle_PreservesCents_WithUnevenBalances()
    {
        // 100 split three ways: payer is owed 66.66, the other two owe 33.34 and 33.32.
        var net = new Dictionary<int, decimal> { [1] = 66.66m, [2] = -33.34m, [3] = -33.32m };

        IReadOnlyList<Settlement> settlements = DebtSettlement.Settle(net);

        Assert.Equal(66.66m, settlements.Sum(settlement => settlement.Amount));
        AssertConserved(net, settlements);
    }

    // Every transfer leaves each person exactly square: applying all transfers to the starting
    // balances must zero everyone out, and no transfer may carry a non-positive amount.
    private static void AssertConserved(
        IReadOnlyDictionary<int, decimal> net, IReadOnlyList<Settlement> settlements)
    {
        Dictionary<int, decimal> running = net.ToDictionary(entry => entry.Key, entry => entry.Value);

        foreach (Settlement settlement in settlements)
        {
            Assert.True(settlement.Amount > 0);
            running[settlement.FromUserId] += settlement.Amount;
            running[settlement.ToUserId] -= settlement.Amount;
        }

        Assert.All(running.Values, balance => Assert.Equal(0m, balance));
    }
}

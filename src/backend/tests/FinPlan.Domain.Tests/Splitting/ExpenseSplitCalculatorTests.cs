using FinPlan.Domain.Splitting;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.Splitting;

// Regression coverage for the math extracted out of ActivityExpense: it must keep resolving splits
// exactly as before (cents never leak), now from the single shared home used by activities and
// contact ledgers alike.
public class ExpenseSplitCalculatorTests
{
    private static SplitParticipant Equal(int userId) => new(userId, null, null);

    private static Result<IReadOnlyList<ResolvedSplit>> BuildEqual(decimal amount, params int[] userIds) =>
        ExpenseSplitCalculator.Build(amount, SplitType.Equal, userIds.Select(Equal).ToList());

    [Fact]
    public void Equal_DividesEvenly()
    {
        Result<IReadOnlyList<ResolvedSplit>> result = BuildEqual(100m, 1, 2, 3, 4);

        Assert.True(result.IsSuccess);
        Assert.All(result.Value, split => Assert.Equal(25m, split.Amount));
    }

    [Fact]
    public void Equal_DistributesRemainderCents_SoSplitsSumToTotal()
    {
        Result<IReadOnlyList<ResolvedSplit>> result = BuildEqual(100m, 1, 2, 3);

        Assert.True(result.IsSuccess);
        decimal[] amounts = result.Value.Select(split => split.Amount).ToArray();
        Assert.Equal(33.34m, amounts[0]);
        Assert.Equal(33.33m, amounts[1]);
        Assert.Equal(33.33m, amounts[2]);
        Assert.Equal(100m, amounts.Sum());
    }

    [Fact]
    public void Exact_MatchingTotal_Succeeds()
    {
        Result<IReadOnlyList<ResolvedSplit>> result = ExpenseSplitCalculator.Build(
            60m, SplitType.Exact, [new SplitParticipant(1, 40m, null), new SplitParticipant(2, 20m, null)]);

        Assert.True(result.IsSuccess);
        Assert.Equal(60m, result.Value.Sum(split => split.Amount));
    }

    [Fact]
    public void Exact_NotMatchingTotal_Fails()
    {
        Result<IReadOnlyList<ResolvedSplit>> result = ExpenseSplitCalculator.Build(
            60m, SplitType.Exact, [new SplitParticipant(1, 40m, null), new SplitParticipant(2, 25m, null)]);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Percentage_WithRounding_StillSumsToTotal()
    {
        Result<IReadOnlyList<ResolvedSplit>> result = ExpenseSplitCalculator.Build(
            10m, SplitType.Percentage,
            [
                new SplitParticipant(1, null, 33.33m),
                new SplitParticipant(2, null, 33.33m),
                new SplitParticipant(3, null, 33.34m),
            ]);

        Assert.True(result.IsSuccess);
        Assert.Equal(10m, result.Value.Sum(split => split.Amount));
    }

    [Fact]
    public void Percentage_NotSummingTo100_Fails()
    {
        Result<IReadOnlyList<ResolvedSplit>> result = ExpenseSplitCalculator.Build(
            100m, SplitType.Percentage,
            [new SplitParticipant(1, null, 70m), new SplitParticipant(2, null, 40m)]);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void DuplicateParticipant_Fails()
    {
        Result<IReadOnlyList<ResolvedSplit>> result = BuildEqual(100m, 1, 1);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void EmptyParticipants_Fails()
    {
        Result<IReadOnlyList<ResolvedSplit>> result = BuildEqual(100m);

        Assert.True(result.IsFailed);
    }
}

using FinPlan.Domain.Activities;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.Activities;

public class ActivityExpenseTests
{
    private static readonly DateOnly Today = new(2026, 1, 1);

    private static SplitParticipant Equal(int userId) => new(userId, null, null);

    private static Result<ActivityExpense> CreateEqual(decimal amount, params int[] userIds) =>
        ActivityExpense.Create(
            activityId: 1, "Dinner", Today, amount, paidByUserId: userIds[0], SplitType.Equal,
            userIds.Select(Equal).ToList());

    [Fact]
    public void Equal_DividesEvenly()
    {
        Result<ActivityExpense> result = CreateEqual(100m, 1, 2, 3, 4);

        Assert.True(result.IsSuccess);
        Assert.All(result.Value.Splits, split => Assert.Equal(25m, split.Amount));
        Assert.Equal(100m, result.Value.Splits.Sum(split => split.Amount));
    }

    [Fact]
    public void Equal_DistributesRemainderCents_SoSplitsSumToTotal()
    {
        Result<ActivityExpense> result = CreateEqual(100m, 1, 2, 3);

        Assert.True(result.IsSuccess);
        // 100 / 3 = 33.34, 33.33, 33.33 — the leftover cent goes to the first participant.
        decimal[] amounts = result.Value.Splits.Select(split => split.Amount).ToArray();
        Assert.Equal(33.34m, amounts[0]);
        Assert.Equal(33.33m, amounts[1]);
        Assert.Equal(33.33m, amounts[2]);
        Assert.Equal(100m, amounts.Sum());
    }

    [Fact]
    public void Exact_MatchingTotal_Succeeds()
    {
        Result<ActivityExpense> result = ActivityExpense.Create(
            1, "Groceries", Today, 60m, 1, SplitType.Exact,
            [new SplitParticipant(1, 40m, null), new SplitParticipant(2, 20m, null)]);

        Assert.True(result.IsSuccess);
        Assert.Equal(60m, result.Value.Splits.Sum(split => split.Amount));
    }

    [Fact]
    public void Exact_NotMatchingTotal_Fails()
    {
        Result<ActivityExpense> result = ActivityExpense.Create(
            1, "Groceries", Today, 60m, 1, SplitType.Exact,
            [new SplitParticipant(1, 40m, null), new SplitParticipant(2, 25m, null)]);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Percentage_SummingTo100_ResolvesAmountsToTotal()
    {
        Result<ActivityExpense> result = ActivityExpense.Create(
            1, "Rent", Today, 1000m, 1, SplitType.Percentage,
            [new SplitParticipant(1, null, 70m), new SplitParticipant(2, null, 30m)]);

        Assert.True(result.IsSuccess);
        Assert.Equal(700m, result.Value.Splits.Single(split => split.UserId == 1).Amount);
        Assert.Equal(300m, result.Value.Splits.Single(split => split.UserId == 2).Amount);
        Assert.Equal(1000m, result.Value.Splits.Sum(split => split.Amount));
    }

    [Fact]
    public void Percentage_WithRounding_StillSumsToTotal()
    {
        Result<ActivityExpense> result = ActivityExpense.Create(
            1, "Bill", Today, 10m, 1, SplitType.Percentage,
            [
                new SplitParticipant(1, null, 33.33m),
                new SplitParticipant(2, null, 33.33m),
                new SplitParticipant(3, null, 33.34m),
            ]);

        Assert.True(result.IsSuccess);
        Assert.Equal(10m, result.Value.Splits.Sum(split => split.Amount));
    }

    [Fact]
    public void Percentage_NotSummingTo100_Fails()
    {
        Result<ActivityExpense> result = ActivityExpense.Create(
            1, "Bill", Today, 100m, 1, SplitType.Percentage,
            [new SplitParticipant(1, null, 70m), new SplitParticipant(2, null, 40m)]);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void DuplicateParticipant_Fails()
    {
        Result<ActivityExpense> result = CreateEqual(100m, 1, 1);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void EmptyParticipants_Fails()
    {
        Result<ActivityExpense> result = ActivityExpense.Create(
            1, "Dinner", Today, 100m, 1, SplitType.Equal, []);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void NonPositiveAmount_Fails()
    {
        Result<ActivityExpense> result = CreateEqual(0m, 1, 2);

        Assert.True(result.IsFailed);
    }
}

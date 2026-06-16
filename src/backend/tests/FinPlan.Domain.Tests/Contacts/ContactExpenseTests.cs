using FinPlan.Domain.Contacts;
using FinPlan.Domain.Splitting;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.Contacts;

public class ContactExpenseTests
{
    private static readonly DateOnly Today = new(2026, 1, 1);

    private static SplitParticipant Equal(int userId) => new(userId, null, null);

    [Fact]
    public void Create_EqualSplit_BetweenTwoPeople_Succeeds()
    {
        Result<ContactExpense> result = ContactExpense.Create(
            currentUserId: 1, otherUserId: 2, "Dinner", Today, 50m, paidByUserId: 1, SplitType.Equal,
            [Equal(1), Equal(2)]);

        Assert.True(result.IsSuccess);
        Assert.Equal(50m, result.Value.Splits.Sum(split => split.Amount));
        Assert.All(result.Value.Splits, split => Assert.Equal(25m, split.Amount));
    }

    [Fact]
    public void Create_CanonicalizesThePair_RegardlessOfArgumentOrder()
    {
        Result<ContactExpense> result = ContactExpense.Create(
            currentUserId: 5, otherUserId: 2, "Taxi", Today, 20m, paidByUserId: 5, SplitType.Equal,
            [Equal(5), Equal(2)]);

        Assert.True(result.IsSuccess);
        Assert.Equal(2, result.Value.UserAId);
        Assert.Equal(5, result.Value.UserBId);
    }

    [Fact]
    public void Create_WithSelf_Fails()
    {
        Result<ContactExpense> result = ContactExpense.Create(
            currentUserId: 1, otherUserId: 1, "Solo", Today, 20m, paidByUserId: 1, SplitType.Equal,
            [Equal(1)]);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_PayerNotInPair_Fails()
    {
        Result<ContactExpense> result = ContactExpense.Create(
            currentUserId: 1, otherUserId: 2, "Dinner", Today, 50m, paidByUserId: 9, SplitType.Equal,
            [Equal(1), Equal(2)]);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_ParticipantNotInPair_Fails()
    {
        Result<ContactExpense> result = ContactExpense.Create(
            currentUserId: 1, otherUserId: 2, "Dinner", Today, 50m, paidByUserId: 1, SplitType.Equal,
            [Equal(1), Equal(3)]);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_NonPositiveAmount_Fails()
    {
        Result<ContactExpense> result = ContactExpense.Create(
            currentUserId: 1, otherUserId: 2, "Dinner", Today, 0m, paidByUserId: 1, SplitType.Equal,
            [Equal(1), Equal(2)]);

        Assert.True(result.IsFailed);
    }
}

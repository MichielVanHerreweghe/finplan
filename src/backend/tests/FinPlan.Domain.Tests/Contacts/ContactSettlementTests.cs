using FinPlan.Domain.Contacts;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.Contacts;

public class ContactSettlementTests
{
    private static readonly DateOnly Today = new(2026, 1, 1);

    [Fact]
    public void Create_ValidPayment_CanonicalizesPair()
    {
        Result<ContactSettlement> result = ContactSettlement.Create(
            currentUserId: 5, otherUserId: 2, fromUserId: 5, toUserId: 2, amount: 30m, date: Today);

        Assert.True(result.IsSuccess);
        Assert.Equal(2, result.Value.UserAId);
        Assert.Equal(5, result.Value.UserBId);
        Assert.Equal(5, result.Value.FromUserId);
        Assert.Equal(2, result.Value.ToUserId);
    }

    [Fact]
    public void Create_PartyOutsidePair_Fails()
    {
        Result<ContactSettlement> result = ContactSettlement.Create(
            currentUserId: 1, otherUserId: 2, fromUserId: 1, toUserId: 9, amount: 30m, date: Today);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_SameFromAndTo_Fails()
    {
        Result<ContactSettlement> result = ContactSettlement.Create(
            currentUserId: 1, otherUserId: 2, fromUserId: 1, toUserId: 1, amount: 30m, date: Today);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_NonPositiveAmount_Fails()
    {
        Result<ContactSettlement> result = ContactSettlement.Create(
            currentUserId: 1, otherUserId: 2, fromUserId: 1, toUserId: 2, amount: 0m, date: Today);

        Assert.True(result.IsFailed);
    }
}

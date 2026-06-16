using FinPlan.Domain.Invitations;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.Invitations;

public class InvitationTests
{
    [Fact]
    public void Create_ContactWithoutTarget_Succeeds()
    {
        Result<Invitation> result = Invitation.Create(InvitationType.Contact, fromUserId: 1, toUserId: 2, targetId: null);

        Assert.True(result.IsSuccess);
        Assert.Equal(InvitationStatus.Pending, result.Value.Status);
    }

    [Fact]
    public void Create_ContactWithTarget_Fails()
    {
        Result<Invitation> result = Invitation.Create(InvitationType.Contact, 1, 2, targetId: 5);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_MembershipWithoutTarget_Fails()
    {
        Result<Invitation> result = Invitation.Create(InvitationType.GroupMember, 1, 2, targetId: null);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_MembershipWithTarget_Succeeds()
    {
        Result<Invitation> result = Invitation.Create(InvitationType.ActivityMember, 1, 2, targetId: 7);

        Assert.True(result.IsSuccess);
    }

    [Fact]
    public void Create_ToSelf_Fails()
    {
        Result<Invitation> result = Invitation.Create(InvitationType.Contact, 1, 1, null);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_UndefinedType_Fails()
    {
        Result<Invitation> result = Invitation.Create(InvitationType.Undefined, 1, 2, null);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Accept_FromPending_Succeeds()
    {
        Invitation invitation = Invitation.Create(InvitationType.Contact, 1, 2, null).Value;

        Result result = invitation.Accept();

        Assert.True(result.IsSuccess);
        Assert.Equal(InvitationStatus.Accepted, invitation.Status);
    }

    [Fact]
    public void Accept_WhenNotPending_Fails()
    {
        Invitation invitation = Invitation.Create(InvitationType.Contact, 1, 2, null).Value;
        invitation.Accept();

        Result again = invitation.Accept();

        Assert.True(again.IsFailed);
    }

    [Fact]
    public void Decline_AfterAccepted_Fails()
    {
        Invitation invitation = Invitation.Create(InvitationType.Contact, 1, 2, null).Value;
        invitation.Accept();

        Result declined = invitation.Decline();

        Assert.True(declined.IsFailed);
        Assert.Equal(InvitationStatus.Accepted, invitation.Status);
    }

    [Fact]
    public void Decline_FromPending_Succeeds()
    {
        Invitation invitation = Invitation.Create(InvitationType.GroupMember, 1, 2, 3).Value;

        Result result = invitation.Decline();

        Assert.True(result.IsSuccess);
        Assert.Equal(InvitationStatus.Declined, invitation.Status);
    }
}

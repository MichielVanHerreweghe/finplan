using FinPlan.Domain.Common;
using FinPlan.Domain.Groups;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.Groups;

public class GroupTests
{
    [Fact]
    public void Create_AddsCreatorAsMember_AndAGroupOwner()
    {
        Result<Group> result = Group.Create("Household", null, createdByUserId: 1);

        Assert.True(result.IsSuccess);
        Assert.True(result.Value.HasMember(1));
        Assert.Single(result.Value.Members);
        Assert.Equal(OwnerKind.Group, result.Value.Owner.Kind);
    }

    [Fact]
    public void Create_WithEmptyName_Fails()
    {
        Result<Group> result = Group.Create("  ", null, createdByUserId: 1);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_WithoutCreator_Fails()
    {
        Result<Group> result = Group.Create("Household", null, createdByUserId: 0);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void AddMember_NewUser_Succeeds()
    {
        Group group = Group.Create("Household", null, createdByUserId: 1).Value;

        Result added = group.AddMember(2);

        Assert.True(added.IsSuccess);
        Assert.True(group.HasMember(2));
        Assert.Equal(2, group.Members.Count);
    }

    [Fact]
    public void AddMember_Duplicate_Fails()
    {
        Group group = Group.Create("Household", null, createdByUserId: 1).Value;
        group.AddMember(2);

        Result again = group.AddMember(2);

        Assert.True(again.IsFailed);
        Assert.Equal(2, group.Members.Count);
    }

    [Fact]
    public void RemoveMember_Creator_Fails()
    {
        Group group = Group.Create("Household", null, createdByUserId: 1).Value;

        Result removed = group.RemoveMember(1);

        Assert.True(removed.IsFailed);
        Assert.True(group.HasMember(1));
    }

    [Fact]
    public void RemoveMember_ExistingMember_Succeeds()
    {
        Group group = Group.Create("Household", null, createdByUserId: 1).Value;
        group.AddMember(2);

        Result removed = group.RemoveMember(2);

        Assert.True(removed.IsSuccess);
        Assert.False(group.HasMember(2));
    }
}

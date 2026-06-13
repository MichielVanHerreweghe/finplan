using FinPlan.Domain.Activities;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.Activities;

public class ActivityTests
{
    [Fact]
    public void Create_AddsCreatorAsMember()
    {
        Result<Activity> result = Activity.Create("Roommates", null, createdByUserId: 1);

        Assert.True(result.IsSuccess);
        Assert.True(result.Value.HasMember(1));
        Assert.Single(result.Value.Members);
    }

    [Fact]
    public void Create_WithEmptyName_Fails()
    {
        Result<Activity> result = Activity.Create("  ", null, createdByUserId: 1);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_WithoutCreator_Fails()
    {
        Result<Activity> result = Activity.Create("Trip", null, createdByUserId: 0);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void AddMember_NewUser_Succeeds()
    {
        Activity activity = Activity.Create("Trip", null, createdByUserId: 1).Value;

        Result added = activity.AddMember(2);

        Assert.True(added.IsSuccess);
        Assert.True(activity.HasMember(2));
        Assert.Equal(2, activity.Members.Count);
    }

    [Fact]
    public void AddMember_Duplicate_Fails()
    {
        Activity activity = Activity.Create("Trip", null, createdByUserId: 1).Value;
        activity.AddMember(2);

        Result again = activity.AddMember(2);

        Assert.True(again.IsFailed);
        Assert.Equal(2, activity.Members.Count);
    }

    [Fact]
    public void RemoveMember_Creator_Fails()
    {
        Activity activity = Activity.Create("Trip", null, createdByUserId: 1).Value;

        Result removed = activity.RemoveMember(1);

        Assert.True(removed.IsFailed);
        Assert.True(activity.HasMember(1));
    }

    [Fact]
    public void RemoveMember_NonMember_Fails()
    {
        Activity activity = Activity.Create("Trip", null, createdByUserId: 1).Value;

        Result removed = activity.RemoveMember(99);

        Assert.True(removed.IsFailed);
    }

    [Fact]
    public void RemoveMember_ExistingMember_Succeeds()
    {
        Activity activity = Activity.Create("Trip", null, createdByUserId: 1).Value;
        activity.AddMember(2);

        Result removed = activity.RemoveMember(2);

        Assert.True(removed.IsSuccess);
        Assert.False(activity.HasMember(2));
    }
}

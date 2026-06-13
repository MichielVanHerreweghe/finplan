using FinPlan.Domain.Common;
using FluentResults;

namespace FinPlan.Domain.Activities;

// A set of users who share expenses. Deliberately NOT an OwnedEntity: a activity is visible to
// every member, not just its creator, so it must escape the global OwnerId query filter.
// Visibility is enforced instead by membership-scoped repository queries (IActivityRepository).
public sealed class Activity : Entity, IAggregateRoot
{
    private readonly List<ActivityMember> _members = [];

    public string Name { get; private set; }
    public string? Description { get; private set; }

    // The user who created the activity. Always also a member.
    public int CreatedByUserId { get; private set; }

    public IReadOnlyCollection<ActivityMember> Members => _members.AsReadOnly();

    private Activity(string name, string? description, int createdByUserId)
    {
        Name = name;
        Description = description;
        CreatedByUserId = createdByUserId;
    }

    public static Result<Activity> Create(string name, string? description, int createdByUserId)
    {
        Result validationResult = Validate(name, createdByUserId);

        if (validationResult.IsFailed)
            return validationResult;

        Activity activity = new(name, description, createdByUserId);
        activity._members.Add(new ActivityMember(createdByUserId));

        return activity;
    }

    public bool HasMember(int userId) => _members.Any(member => member.UserId == userId);

    public Result AddMember(int userId)
    {
        if (userId <= 0)
            return Result.Fail("Invalid user id.");

        if (HasMember(userId))
            return Result.Fail("User is already a member of this activity.");

        _members.Add(new ActivityMember(userId));

        return Result.Ok();
    }

    public Result RemoveMember(int userId)
    {
        if (userId == CreatedByUserId)
            return Result.Fail("The activity creator cannot be removed from the activity.");

        ActivityMember? member = _members.FirstOrDefault(member => member.UserId == userId);

        if (member is null)
            return Result.Fail("User is not a member of this activity.");

        _members.Remove(member);

        return Result.Ok();
    }

    private static Result Validate(string name, int createdByUserId)
    {
        Result result = new();

        if (string.IsNullOrWhiteSpace(name))
            result.WithError("Name cannot be empty.");

        if (createdByUserId <= 0)
            result.WithError("Invalid creator id.");

        return result;
    }
}

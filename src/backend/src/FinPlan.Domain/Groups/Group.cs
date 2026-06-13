using FinPlan.Domain.Common;
using FluentResults;

namespace FinPlan.Domain.Groups;

// A set of users who share one set of finances. The group owns its pockets/transactions/etc.
// through its own Owner (Kind=Group); members collaborate on that shared owner's data by
// switching their active context to it. NOT an IOwnedEntity itself: a group is visible to its
// members regardless of the active owner, so it stays outside the owner query filter and is
// scoped by membership instead.
public sealed class Group : Entity, IAggregateRoot
{
    private readonly List<GroupMember> _members = [];

    public string Name { get; private set; }
    public string? Description { get; private set; }

    // The group's data owner. Created together with the group; EF stamps OwnerId from the
    // navigation on insert. All of the group's pockets/transactions carry this OwnerId.
    public int OwnerId { get; private set; }

    // Set in the factory, not the constructor: EF binds only mapped scalars to constructor
    // parameters (navigations can't be bound), so the materialization ctor stays scalar-only.
    public Owner Owner { get; private set; } = null!;

    public int CreatedByUserId { get; private set; }

    public IReadOnlyCollection<GroupMember> Members => _members.AsReadOnly();

    private Group(string name, string? description, int createdByUserId)
    {
        Name = name;
        Description = description;
        CreatedByUserId = createdByUserId;
    }

    public static Result<Group> Create(string name, string? description, int createdByUserId)
    {
        Result validationResult = Validate(name, createdByUserId);

        if (validationResult.IsFailed)
            return validationResult;

        Group group = new(name, description, createdByUserId) { Owner = Owner.Group() };
        group._members.Add(new GroupMember(createdByUserId));

        return group;
    }

    public bool HasMember(int userId) => _members.Any(member => member.UserId == userId);

    public Result AddMember(int userId)
    {
        if (userId <= 0)
            return Result.Fail("Invalid user id.");

        if (HasMember(userId))
            return Result.Fail("User is already a member of this group.");

        _members.Add(new GroupMember(userId));

        return Result.Ok();
    }

    public Result RemoveMember(int userId)
    {
        if (userId == CreatedByUserId)
            return Result.Fail("The group creator cannot be removed from the group.");

        GroupMember? member = _members.FirstOrDefault(member => member.UserId == userId);

        if (member is null)
            return Result.Fail("User is not a member of this group.");

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

using FinPlan.Domain.Common;

namespace FinPlan.Domain.Groups;

// A user's membership in a group. A child of the Group aggregate, never loaded on its own.
// NOT an IOwnedEntity: membership must be readable outside the owner query filter (the active-
// context resolver and the "my groups" list both query it before/independently of any owner).
public sealed class GroupMember : Entity
{
    public int GroupId { get; private set; }
    public int UserId { get; private set; }

    internal GroupMember(int userId)
    {
        UserId = userId;
    }
}

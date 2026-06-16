using FinPlan.Domain.Common;

namespace FinPlan.Domain.Activities;

// A user's membership in a activity. A child of the Activity aggregate, never loaded on its own,
// so it is not an aggregate root. UserId references a User but is kept as a plain column
// (no navigation) to stay out of the owner/soft-delete query-filter web around User.
public sealed class ActivityMember : Entity
{
    public int ActivityId { get; private set; }
    public int UserId { get; private set; }

    internal ActivityMember(int userId)
    {
        UserId = userId;
    }
}

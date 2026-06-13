namespace FinPlan.Domain.Common;

// The acting user behind the request, distinct from ICurrentOwnerProvider (which gives the
// active owner context the request's data is scoped to). Group-management handlers need to know
// who is acting (membership checks, recording the creator) independently of which owner context
// is active. Returns 0 when there is no authenticated, provisioned user.
public interface ICurrentUserProvider
{
    int CurrentUserId { get; }
}

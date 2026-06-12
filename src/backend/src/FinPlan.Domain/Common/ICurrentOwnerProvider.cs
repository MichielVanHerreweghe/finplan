namespace FinPlan.Domain.Common;

// Supplies the user id that owned-entity reads are filtered by and that new owned
// entities are assigned to. Resolved per request from the authenticated principal;
// returns 0 when there is no authenticated, provisioned user (design-time, startup
// migration, anonymous requests) so owned reads return nothing rather than leaking.
public interface ICurrentOwnerProvider
{
    int CurrentOwnerId { get; }
}

namespace FinPlan.Domain.Common;

// Marks an aggregate as belonging to a single user. The OwnerId is assigned once,
// centrally, when the entity is first persisted (see the SaveChanges hook) and is
// the column the global query filter scopes every read by.
public interface IOwnedEntity
{
    int OwnerId { get; }
}

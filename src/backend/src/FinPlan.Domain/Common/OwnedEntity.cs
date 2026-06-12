namespace FinPlan.Domain.Common;

// Base for aggregates that belong to a single user. OwnerId starts unset (0) and is
// assigned exactly once when the entity is first persisted (see the SaveChanges hook
// in ApplicationDbContext). Re-owning to a different user is a bug and throws.
public abstract class OwnedEntity : Entity, IOwnedEntity
{
    public int OwnerId { get; private set; }

    public void AssignOwner(int ownerId)
    {
        if (ownerId <= 0)
            throw new ArgumentOutOfRangeException(nameof(ownerId), "Owner id must be positive.");

        if (OwnerId == ownerId)
            return;

        if (OwnerId != 0)
            throw new InvalidOperationException("Owner cannot be reassigned.");

        OwnerId = ownerId;
    }
}

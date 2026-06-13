namespace FinPlan.Domain.Common;

// The unit every owned aggregate belongs to, minted from one shared id space so a personal
// owner and a group owner can never collide under the global OwnerId query filter. A user has
// a Personal owner; a group has a Group owner. Owner itself is NOT an IOwnedEntity — it is the
// thing OwnerId points at, so it must stay outside the owner filter.
public sealed class Owner : Entity, IAggregateRoot
{
    public OwnerKind Kind { get; private set; }

    private Owner(OwnerKind kind)
    {
        Kind = kind;
    }

    public static Owner Personal() => new(OwnerKind.Personal);

    public static Owner Group() => new(OwnerKind.Group);
}

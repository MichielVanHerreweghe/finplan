namespace FinPlan.Domain.Common;

public abstract class Entity : IEquatable<Entity>
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; protected set; } = DateTime.UtcNow;
    public bool IsDeleted => DeletedAt is not null;
    public DateTime? DeletedAt { get; private set; }

    public void Update()
    {
        UpdatedAt = DateTime.UtcNow;
    }

    public void Delete()
    {
        DeletedAt = DateTime.UtcNow;
    }

    public void Restore()
    {
        DeletedAt = null;
    }

    public bool Equals(Entity? other)
    {
        if (other is null)
            return false;

        if (ReferenceEquals(this, other))
            return true;

        if (GetType() != other.GetType())
            return false;

        if (Id == 0 || other.Id == 0)
            return false;

        return Id == other.Id;
    }

    public override bool Equals(object? obj) => Equals(obj as Entity);

    private int? _cachedHashCode;

    public override int GetHashCode() =>
        _cachedHashCode ??= HashCode.Combine(GetType(), Id);

    public static bool operator ==(Entity? left, Entity? right) =>
        Equals(left, right);

    public static bool operator !=(Entity? left, Entity? right) =>
        !Equals(left, right);
}
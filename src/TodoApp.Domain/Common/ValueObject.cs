namespace TodoApp.Domain.Common;

/// <summary>
/// Base class for value objects: immutable types identified by the composition
/// of their values rather than by identity. Implements structural equality.
/// </summary>
public abstract class ValueObject
{
    protected abstract IEnumerable<object?> GetEqualityComponents();

    public override bool Equals(object? obj) =>
        obj is not null
        && obj.GetType() == GetType()
        && GetEqualityComponents().SequenceEqual(((ValueObject)obj).GetEqualityComponents());

    public override int GetHashCode() =>
        GetEqualityComponents().Aggregate(0, HashCode.Combine);

    public static bool operator ==(ValueObject? left, ValueObject? right) =>
        left?.Equals(right) ?? right is null;

    public static bool operator !=(ValueObject? left, ValueObject? right) =>
        !(left == right);
}

namespace TodoApp.Domain.Common;

/// <summary>
/// Base class for entities that must be auditable. Timestamps are populated by
/// <c>AuditableEntityInterceptor</c> in the Infrastructure layer.
/// </summary>
public abstract class BaseAuditableEntity : BaseEntity
{
    public DateTime CreatedAtUtc { get; set; }

    public DateTime? LastModifiedAtUtc { get; set; }
}

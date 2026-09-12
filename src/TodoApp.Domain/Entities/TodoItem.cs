using TodoApp.Domain.Common;
using TodoApp.Domain.Constants;
using TodoApp.Domain.Events;

namespace TodoApp.Domain.Entities;

/// <summary>
/// A task that belongs to a <see cref="TodoList"/> aggregate. All state
/// changes go through intent-revealing methods that guard the invariants.
/// </summary>
public class TodoItem : BaseAuditableEntity
{
    public const int MaxTitleLength = 200;
    public const int MaxNoteLength = 2000;

    private TodoItem()
    {
        // Required by EF Core.
        Title = null!;
    }

    public TodoItem(Guid listId, string title, PriorityLevel priority, string? note = null, DateTime? dueDateUtc = null)
    {
        ListId = listId;
        Title = GuardTitle(title);
        Note = note;
        Priority = priority;
        DueDateUtc = dueDateUtc;
    }

    public Guid ListId { get; private set; }

    public string Title { get; private set; }

    public string? Note { get; private set; }

    public PriorityLevel Priority { get; private set; }

    public DateTime? DueDateUtc { get; private set; }

    public bool Done { get; private set; }

    public DateTime? CompletedAtUtc { get; private set; }

    public void UpdateDetails(string title, string? note, PriorityLevel priority, DateTime? dueDateUtc)
    {
        Title = GuardTitle(title);
        Note = note;
        Priority = priority;
        DueDateUtc = dueDateUtc;
    }

    /// <summary>
    /// Marks the item as done and raises a <see cref="TodoItemCompletedEvent"/>.
    /// Idempotent: completing an already completed item is a no-op.
    /// </summary>
    public void Complete(DateTime utcNow)
    {
        if (Done)
        {
            return;
        }

        Done = true;
        CompletedAtUtc = utcNow;
        AddDomainEvent(new TodoItemCompletedEvent(this));
    }

    public void Reopen()
    {
        Done = false;
        CompletedAtUtc = null;
    }

    private static string GuardTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new DomainException("Todo item title is required.");
        }

        if (title.Length > MaxTitleLength)
        {
            throw new DomainException($"Todo item title cannot exceed {MaxTitleLength} characters.");
        }

        return title.Trim();
    }
}

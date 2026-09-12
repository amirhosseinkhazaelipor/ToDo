using TodoApp.Domain.Common;
using TodoApp.Domain.Constants;
using TodoApp.Domain.Events;
using TodoApp.Domain.ValueObjects;

namespace TodoApp.Domain.Entities;

/// <summary>
/// Aggregate Root of the Todo bounded context. Owns its <see cref="TodoItem"/>
/// children: items are only created or removed through this aggregate so that
/// invariants and domain events stay consistent.
/// </summary>
public class TodoList : BaseAuditableEntity
{
    public const int MaxTitleLength = 100;

    private readonly List<TodoItem> _items = [];

    private TodoList()
    {
        // Required by EF Core; the properties are initialised via the public constructor.
        Title = null!;
        Colour = null!;
    }

    public TodoList(string title, Colour colour)
    {
        Title = GuardTitle(title);
        Colour = colour ?? throw new ArgumentNullException(nameof(colour));
    }

    public string Title { get; private set; }

    public Colour Colour { get; private set; }

    public IReadOnlyCollection<TodoItem> Items => _items.AsReadOnly();

    public void UpdateDetails(string title, Colour colour)
    {
        Title = GuardTitle(title);
        Colour = colour ?? throw new ArgumentNullException(nameof(colour));
    }

    /// <summary>
    /// Creates a new item inside this aggregate and raises a creation event.
    /// </summary>
    public TodoItem AddItem(string title, PriorityLevel priority, string? note = null, DateTime? dueDateUtc = null)
    {
        var item = new TodoItem(Id, title, priority, note, dueDateUtc);

        _items.Add(item);
        AddDomainEvent(new TodoItemCreatedEvent(item));

        return item;
    }

    public void RemoveItem(Guid itemId)
    {
        var item = _items.SingleOrDefault(i => i.Id == itemId)
            ?? throw new DomainException($"Item '{itemId}' does not belong to list '{Id}'.");

        _items.Remove(item);
    }

    private static string GuardTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new DomainException("Todo list title is required.");
        }

        if (title.Length > MaxTitleLength)
        {
            throw new DomainException($"Todo list title cannot exceed {MaxTitleLength} characters.");
        }

        return title.Trim();
    }
}

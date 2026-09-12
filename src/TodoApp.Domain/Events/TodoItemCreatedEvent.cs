using MediatR;
using TodoApp.Domain.Common;
using TodoApp.Domain.Entities;

namespace TodoApp.Domain.Events;

/// <summary>Raised when a new todo item is added to a list.</summary>
public sealed class TodoItemCreatedEvent(TodoItem item) : BaseEvent
{
    public TodoItem Item { get; } = item;
}

using MediatR;
using TodoApp.Domain.Common;
using TodoApp.Domain.Entities;

namespace TodoApp.Domain.Events;

/// <summary>Raised when a todo item is marked as done.</summary>
public sealed class TodoItemCompletedEvent(TodoItem item) : BaseEvent
{
    public TodoItem Item { get; } = item;
}

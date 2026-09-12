using System.Linq.Expressions;
using TodoApp.Domain.Constants;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Common.Specifications;

/// <summary>Open (not done) items whose due date has passed.</summary>
public sealed class OverdueTodoItemSpecification(DateTime utcNow) : ISpecification<TodoItem>
{
    public Expression<Func<TodoItem, bool>> ToExpression() =>
        item => !item.Done && item.DueDateUtc != null && item.DueDateUtc < utcNow;
}

/// <summary>Items that belong to a specific list.</summary>
public sealed class TodoItemByListSpecification(Guid listId) : ISpecification<TodoItem>
{
    public Expression<Func<TodoItem, bool>> ToExpression() =>
        item => item.ListId == listId;
}

/// <summary>Items filtered by their completion state.</summary>
public sealed class TodoItemIsDoneSpecification(bool isDone) : ISpecification<TodoItem>
{
    public Expression<Func<TodoItem, bool>> ToExpression() =>
        item => item.Done == isDone;
}

/// <summary>Items with a specific priority.</summary>
public sealed class TodoItemByPrioritySpecification(PriorityLevel priority) : ISpecification<TodoItem>
{
    public Expression<Func<TodoItem, bool>> ToExpression() =>
        item => item.Priority == priority;
}

/// <summary>Case-insensitive title search.</summary>
public sealed class TodoItemTitleContainsSpecification(string searchTerm) : ISpecification<TodoItem>
{
    public Expression<Func<TodoItem, bool>> ToExpression() =>
        item => item.Title.ToLower().Contains(searchTerm.ToLower());
}

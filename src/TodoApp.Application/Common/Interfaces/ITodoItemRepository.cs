using TodoApp.Application.Common.Specifications;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Common.Interfaces;

/// <summary>
/// Read-oriented repository for <see cref="TodoItem"/> queries. Writes go
/// through the <see cref="TodoList"/> aggregate root (DDD).
/// </summary>
public interface ITodoItemRepository
{
    Task<TodoItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<(IReadOnlyList<TodoItem> Items, int TotalCount)> GetPagedAsync(
        ISpecification<TodoItem>? specification,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken);

    /// <summary>
    /// Marks an item created through its aggregate as new. Required because
    /// the domain assigns GUID keys, so EF Core cannot infer the state by itself.
    /// </summary>
    Task AddAsync(TodoItem todoItem, CancellationToken cancellationToken);
}

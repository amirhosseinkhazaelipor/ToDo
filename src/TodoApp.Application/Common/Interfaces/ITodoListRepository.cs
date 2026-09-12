using TodoApp.Domain.Entities;

namespace TodoApp.Application.Common.Interfaces;

/// <summary>
/// Repository for the <see cref="TodoList"/> aggregate root.
/// Interfaces live in Application ( Dependency Inversion); implementations in Infrastructure.
/// </summary>
public interface ITodoListRepository
{
    Task<(IReadOnlyList<TodoList> Items, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);

    Task<TodoList?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<TodoList?> GetByIdWithItemsAsync(Guid id, CancellationToken cancellationToken);

    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken);

    Task AddAsync(TodoList todoList, CancellationToken cancellationToken);

    void Remove(TodoList todoList);
}

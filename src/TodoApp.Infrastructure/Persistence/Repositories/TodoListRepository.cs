using Microsoft.EntityFrameworkCore;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.Infrastructure.Persistence.Repositories;

/// <summary>
/// EF Core implementation of the <see cref="TodoList"/> repository.
/// </summary>
public class TodoListRepository(ApplicationDbContext dbContext) : ITodoListRepository
{
    public async Task<(IReadOnlyList<TodoList> Items, int TotalCount)> GetPagedAsync(
        int pageNumber, int pageSize, CancellationToken cancellationToken)
    {
        var query = dbContext.TodoLists
            .AsNoTracking()
            .Include(list => list.Items)
            .OrderByDescending(list => list.CreatedAtUtc);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public Task<TodoList?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        dbContext.TodoLists
            .FirstOrDefaultAsync(list => list.Id == id, cancellationToken);

    public Task<TodoList?> GetByIdWithItemsAsync(Guid id, CancellationToken cancellationToken) =>
        dbContext.TodoLists
            .Include(list => list.Items)
            .FirstOrDefaultAsync(list => list.Id == id, cancellationToken);

    public Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken) =>
        dbContext.TodoLists.AnyAsync(list => list.Id == id, cancellationToken);

    public async Task AddAsync(TodoList todoList, CancellationToken cancellationToken) =>
        await dbContext.TodoLists.AddAsync(todoList, cancellationToken);

    public void Remove(TodoList todoList) =>
        dbContext.TodoLists.Remove(todoList);
}

using Microsoft.EntityFrameworkCore;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Application.Common.Specifications;
using TodoApp.Domain.Entities;

namespace TodoApp.Infrastructure.Persistence.Repositories;

/// <summary>
/// EF Core implementation of the <see cref="TodoItem"/> repository.
/// Filtering predicates arrive as <see cref="ISpecification{T}"/> expressions
/// that remain fully translatable to SQL.
/// </summary>
public class TodoItemRepository(ApplicationDbContext dbContext) : ITodoItemRepository
{
    public Task<TodoItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        dbContext.TodoItems
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

    public async Task<(IReadOnlyList<TodoItem> Items, int TotalCount)> GetPagedAsync(
        ISpecification<TodoItem>? specification,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken)
    {
        IQueryable<TodoItem> query = dbContext.TodoItems.AsNoTracking();

        if (specification is not null)
        {
            query = query.Where(specification.ToExpression());
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(item => item.Done)               // open items first
            .ThenByDescending(item => item.Priority)  // then by importance
            .ThenBy(item => item.DueDateUtc)          // then by due date
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task AddAsync(TodoItem todoItem, CancellationToken cancellationToken) =>
        await dbContext.TodoItems.AddAsync(todoItem, cancellationToken);
}

using MediatR;
using TodoApp.Application.Common.Dtos;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Application.Common.Mappings;
using TodoApp.Application.Common.Models;
using TodoApp.Application.Common.Specifications;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.TodoItems.Queries.GetTodoItems;

public sealed class GetTodoItemsQueryHandler(ITodoItemRepository repository, IDateTime dateTime)
    : IRequestHandler<GetTodoItemsQuery, PaginatedList<TodoItemDto>>
{
    public async Task<PaginatedList<TodoItemDto>> Handle(GetTodoItemsQuery request, CancellationToken cancellationToken)
    {
        ISpecification<TodoItem>? specification = null;

        if (request.ListId is { } listId)
        {
            specification = specification.And(new TodoItemByListSpecification(listId));
        }

        if (request.Done is { } done)
        {
            specification = specification.And(new TodoItemIsDoneSpecification(done));
        }

        if (request.Priority is { } priority)
        {
            specification = specification.And(new TodoItemByPrioritySpecification(priority));
        }

        if (request.Overdue == true)
        {
            specification = specification.And(new OverdueTodoItemSpecification(dateTime.NowUtc));
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            specification = specification.And(new TodoItemTitleContainsSpecification(request.Search));
        }

        var (todoItems, totalCount) = await repository.GetPagedAsync(
            specification, request.PageNumber, request.PageSize, cancellationToken);

        return new PaginatedList<TodoItemDto>(
            [.. todoItems.Select(item => item.ToDto())],
            totalCount,
            request.PageNumber,
            request.PageSize);
    }
}

using MediatR;
using TodoApp.Application.Common.Dtos;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Application.Common.Mappings;
using TodoApp.Application.Common.Models;

namespace TodoApp.Application.TodoLists.Queries.GetTodoLists;

public sealed class GetTodoListsQueryHandler(ITodoListRepository repository)
    : IRequestHandler<GetTodoListsQuery, PaginatedList<TodoListSummaryDto>>
{
    public async Task<PaginatedList<TodoListSummaryDto>> Handle(GetTodoListsQuery request, CancellationToken cancellationToken)
    {
        var (todoLists, totalCount) = await repository.GetPagedAsync(request.PageNumber, request.PageSize, cancellationToken);

        return new PaginatedList<TodoListSummaryDto>(
            [.. todoLists.Select(list => list.ToSummaryDto())],
            totalCount,
            request.PageNumber,
            request.PageSize);
    }
}

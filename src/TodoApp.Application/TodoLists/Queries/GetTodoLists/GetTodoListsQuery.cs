using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;
using TodoApp.Application.Common.Dtos;
using TodoApp.Application.Common.Models;

namespace TodoApp.Application.TodoLists.Queries.GetTodoLists;

public sealed record GetTodoListsQuery(int PageNumber = 1, int PageSize = 20)
    : IQuery<PaginatedList<TodoListSummaryDto>>;

public sealed class GetTodoListsQueryValidator : AbstractValidator<GetTodoListsQuery>
{
    public GetTodoListsQueryValidator()
    {
        RuleFor(query => query.PageNumber)
            .GreaterThanOrEqualTo(1);

        RuleFor(query => query.PageSize)
            .GreaterThanOrEqualTo(1)
            .LessThanOrEqualTo(100);
    }
}

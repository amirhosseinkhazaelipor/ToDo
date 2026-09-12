using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;
using TodoApp.Application.Common.Dtos;
using TodoApp.Application.Common.Models;
using TodoApp.Domain.Constants;

namespace TodoApp.Application.TodoItems.Queries.GetTodoItems;

/// <summary>
/// Paged and filtered query over todo items. All filters are optional and
/// are combined via the Specification pattern.
/// </summary>
public sealed record GetTodoItemsQuery(
    int PageNumber = 1,
    int PageSize = 20,
    Guid? ListId = null,
    bool? Done = null,
    PriorityLevel? Priority = null,
    bool? Overdue = null,
    string? Search = null) : IQuery<PaginatedList<TodoItemDto>>;

public sealed class GetTodoItemsQueryValidator : AbstractValidator<GetTodoItemsQuery>
{
    public GetTodoItemsQueryValidator()
    {
        RuleFor(query => query.PageNumber)
            .GreaterThanOrEqualTo(1);

        RuleFor(query => query.PageSize)
            .GreaterThanOrEqualTo(1)
            .LessThanOrEqualTo(100);

        RuleFor(query => query.Search)
            .MaximumLength(200);
    }
}

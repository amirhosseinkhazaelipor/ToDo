using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;
using TodoApp.Application.Common.Dtos;

namespace TodoApp.Application.TodoItems.Queries.GetTodoItemById;

public sealed record GetTodoItemByIdQuery(Guid Id) : IQuery<TodoItemDto>;

public sealed class GetTodoItemByIdQueryValidator : AbstractValidator<GetTodoItemByIdQuery>
{
    public GetTodoItemByIdQueryValidator()
    {
        RuleFor(query => query.Id)
            .NotEmpty();
    }
}

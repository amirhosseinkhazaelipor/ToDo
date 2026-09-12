using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;
using TodoApp.Application.Common.Dtos;

namespace TodoApp.Application.TodoLists.Queries.GetTodoListById;

public sealed record GetTodoListByIdQuery(Guid Id) : IQuery<TodoListDto>;

public sealed class GetTodoListByIdQueryValidator : AbstractValidator<GetTodoListByIdQuery>
{
    public GetTodoListByIdQueryValidator()
    {
        RuleFor(query => query.Id)
            .NotEmpty();
    }
}

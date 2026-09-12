using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;

namespace TodoApp.Application.TodoItems.Commands.ReopenTodoItem;

public sealed record ReopenTodoItemCommand(Guid Id) : ICommand;

public sealed class ReopenTodoItemCommandValidator : AbstractValidator<ReopenTodoItemCommand>
{
    public ReopenTodoItemCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();
    }
}

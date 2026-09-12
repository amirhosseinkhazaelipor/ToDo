using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;

namespace TodoApp.Application.TodoItems.Commands.CompleteTodoItem;

public sealed record CompleteTodoItemCommand(Guid Id) : ICommand;

public sealed class CompleteTodoItemCommandValidator : AbstractValidator<CompleteTodoItemCommand>
{
    public CompleteTodoItemCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();
    }
}

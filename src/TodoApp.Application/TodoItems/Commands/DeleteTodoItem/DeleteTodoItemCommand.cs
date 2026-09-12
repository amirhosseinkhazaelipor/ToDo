using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;

namespace TodoApp.Application.TodoItems.Commands.DeleteTodoItem;

public sealed record DeleteTodoItemCommand(Guid Id) : ICommand;

public sealed class DeleteTodoItemCommandValidator : AbstractValidator<DeleteTodoItemCommand>
{
    public DeleteTodoItemCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();
    }
}

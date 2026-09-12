using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;

namespace TodoApp.Application.TodoLists.Commands.DeleteTodoList;

public sealed record DeleteTodoListCommand(Guid Id) : ICommand;

public sealed class DeleteTodoListCommandValidator : AbstractValidator<DeleteTodoListCommand>
{
    public DeleteTodoListCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();
    }
}

using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;
using TodoApp.Domain.Constants;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.TodoItems.Commands.CreateTodoItem;

public sealed record CreateTodoItemCommand(
    Guid ListId,
    string Title,
    string? Note,
    PriorityLevel Priority,
    DateTime? DueDateUtc) : ICommand<Guid>;

public sealed class CreateTodoItemCommandValidator : AbstractValidator<CreateTodoItemCommand>
{
    public CreateTodoItemCommandValidator()
    {
        RuleFor(command => command.ListId)
            .NotEmpty();

        RuleFor(command => command.Title)
            .NotEmpty()
            .MaximumLength(TodoItem.MaxTitleLength);

        RuleFor(command => command.Note)
            .MaximumLength(TodoItem.MaxNoteLength);

        RuleFor(command => command.Priority)
            .IsInEnum();
    }
}

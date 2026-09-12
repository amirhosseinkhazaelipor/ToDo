using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;
using TodoApp.Domain.Constants;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.TodoItems.Commands.UpdateTodoItem;

public sealed record UpdateTodoItemCommand(
    Guid Id,
    string Title,
    string? Note,
    PriorityLevel Priority,
    DateTime? DueDateUtc) : ICommand;

public sealed class UpdateTodoItemCommandValidator : AbstractValidator<UpdateTodoItemCommand>
{
    public UpdateTodoItemCommandValidator()
    {
        RuleFor(command => command.Id)
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

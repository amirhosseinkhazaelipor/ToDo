using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;
using TodoApp.Domain.Entities;
using TodoApp.Domain.ValueObjects;

namespace TodoApp.Application.TodoLists.Commands.UpdateTodoList;

public sealed record UpdateTodoListCommand(Guid Id, string Title, string Colour) : ICommand;

public sealed class UpdateTodoListCommandValidator : AbstractValidator<UpdateTodoListCommand>
{
    public UpdateTodoListCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();

        RuleFor(command => command.Title)
            .NotEmpty()
            .MaximumLength(TodoList.MaxTitleLength);

        RuleFor(command => command.Colour)
            .NotEmpty()
            .Must(Colour.IsValid)
            .WithMessage("'{PropertyName}' must be a valid hex colour such as #1FA2FF.");
    }
}

using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;
using TodoApp.Domain.Entities;
using TodoApp.Domain.ValueObjects;

namespace TodoApp.Application.TodoLists.Commands.CreateTodoList;

public sealed record CreateTodoListCommand(string Title, string Colour) : ICommand<Guid>;

public sealed class CreateTodoListCommandValidator : AbstractValidator<CreateTodoListCommand>
{
    public CreateTodoListCommandValidator()
    {
        RuleFor(command => command.Title)
            .NotEmpty()
            .MaximumLength(TodoList.MaxTitleLength);

        RuleFor(command => command.Colour)
            .NotEmpty()
            .Must(Colour.IsValid)
            .WithMessage("'{PropertyName}' must be a valid hex colour such as #1FA2FF.");
    }
}

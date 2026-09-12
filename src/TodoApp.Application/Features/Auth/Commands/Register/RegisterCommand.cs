using FluentValidation;
using MediatR;
using TodoApp.Application.Common.Abstractions;
using TodoApp.Application.Features.Auth.Dtos;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Features.Auth.Commands.Register;

public sealed record RegisterCommand(string Name, string Email, string Password)
    : ICommand<AuthSessionDto>;

public sealed class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(command => command.Name)
            .NotEmpty()
            .MaximumLength(User.MaxNameLength);

        RuleFor(command => command.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(User.MaxEmailLength);

        RuleFor(command => command.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(128);
    }
}

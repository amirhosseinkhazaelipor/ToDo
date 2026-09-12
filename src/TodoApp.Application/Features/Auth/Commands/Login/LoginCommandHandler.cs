using MediatR;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Application.Features.Auth.Dtos;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Features.Auth.Commands.Login;

public sealed class LoginCommandHandler(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    ITokenProvider tokenProvider)
    : IRequestHandler<LoginCommand, AuthSessionDto>
{
    public async Task<AuthSessionDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);

        // The same message for both cases avoids leaking which emails exist.
        if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new DomainRuleViolationException("Invalid email or password.");
        }

        return new AuthSessionDto(new UserDto(user.Id, user.Name, user.Email), tokenProvider.CreateToken(user));
    }
}

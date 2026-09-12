using MediatR;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Application.Features.Auth.Dtos;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Features.Auth.Commands.Register;

public sealed class RegisterCommandHandler(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    ITokenProvider tokenProvider,
    IUnitOfWork unitOfWork)
    : IRequestHandler<RegisterCommand, AuthSessionDto>
{
    public async Task<AuthSessionDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        if (await userRepository.ExistsByEmailAsync(normalizedEmail, cancellationToken))
        {
            throw new DomainRuleViolationException("This email address is already registered.");
        }

        var user = new User(request.Name, normalizedEmail, passwordHasher.Hash(request.Password));

        await userRepository.AddAsync(user, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new AuthSessionDto(new UserDto(user.Id, user.Name, user.Email), tokenProvider.CreateToken(user));
    }
}

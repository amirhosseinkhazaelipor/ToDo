namespace TodoApp.Application.Features.Auth.Dtos;

/// <summary>Public representation of a user (never exposes the password hash).</summary>
public sealed record UserDto(Guid Id, string Name, string Email);

/// <summary>Result of a successful login/registration: user + access token.</summary>
public sealed record AuthSessionDto(UserDto User, string Token);

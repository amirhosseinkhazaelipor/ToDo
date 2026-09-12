using TodoApp.Domain.Entities;

namespace TodoApp.Application.Common.Interfaces;

/// <summary>
/// Abstraction over token generation for authenticated sessions.
/// </summary>
public interface ITokenProvider
{
    string CreateToken(User user);
}

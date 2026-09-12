namespace TodoApp.Application.Common.Interfaces;

/// <summary>
/// Abstraction over password hashing so the Application layer never touches
/// cryptographic details (Dependency Inversion).
/// </summary>
public interface IPasswordHasher
{
    string Hash(string password);

    bool Verify(string password, string passwordHash);
}

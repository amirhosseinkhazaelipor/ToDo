using TodoApp.Domain.Common;

namespace TodoApp.Domain.Entities;

/// <summary>
/// Registered application user. The password is stored only as a PBKDF2 hash.
/// </summary>
public class User : BaseAuditableEntity
{
    public const int MaxNameLength = 100;
    public const int MaxEmailLength = 254;

    private User()
    {
        // Required by EF Core.
        Name = null!;
        Email = null!;
        PasswordHash = null!;
    }

    public User(string name, string email, string passwordHash)
    {
        Name = GuardName(name);
        Email = GuardEmail(email);
        PasswordHash = passwordHash ?? throw new ArgumentNullException(nameof(passwordHash));
    }

    public string Name { get; private set; }

    public string Email { get; private set; }

    public string PasswordHash { get; private set; }

    public void UpdateProfile(string name) => Name = GuardName(name);

    public void SetPasswordHash(string passwordHash) =>
        PasswordHash = passwordHash ?? throw new ArgumentNullException(nameof(passwordHash));

    private static string GuardName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("User name is required.");
        }

        if (name.Length > MaxNameLength)
        {
            throw new DomainException($"User name cannot exceed {MaxNameLength} characters.");
        }

        return name.Trim();
    }

    private static string GuardEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
        {
            throw new DomainException("A valid email address is required.");
        }

        return email.Trim().ToLowerInvariant();
    }
}

using System.Security.Cryptography;
using Microsoft.Extensions.Options;
using TodoApp.Application.Common.Interfaces;

namespace TodoApp.Infrastructure.Auth;

public sealed class PasswordHasherOptions
{
    public const string SectionName = "PasswordHasher";

    public int Iterations { get; set; } = 100_000;

    public int SaltSizeBytes { get; set; } = 16;

    public int HashSizeBytes { get; set; } = 32;
}

/// <summary>
/// PBKDF2 (HMAC-SHA256) password hashing. Stored format:
/// {iterations}.{base64-salt}.{base64-hash} — verified in constant time.
/// </summary>
public sealed class Pbkdf2PasswordHasher(IOptions<PasswordHasherOptions> options) : IPasswordHasher
{
    private PasswordHasherOptions Options => options.Value;

    public string Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(Options.SaltSizeBytes);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            password, salt, Options.Iterations, HashAlgorithmName.SHA256, Options.HashSizeBytes);

        return $"{Options.Iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public bool Verify(string password, string passwordHash)
    {
        var parts = passwordHash.Split('.');
        if (parts.Length != 3)
        {
            return false;
        }

        var iterations = int.Parse(parts[0]);
        var salt = Convert.FromBase64String(parts[1]);
        var expectedHash = Convert.FromBase64String(parts[2]);

        var actualHash = Rfc2898DeriveBytes.Pbkdf2(
            password, salt, iterations, HashAlgorithmName.SHA256, expectedHash.Length);

        return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
    }
}

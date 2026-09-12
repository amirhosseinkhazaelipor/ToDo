using Microsoft.Extensions.Options;

namespace TodoApp.Infrastructure.Auth;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "TodoApp";

    public string Audience { get; set; } = "TodoAppClient";

    /// <summary>At least 32 characters. Use a secret store in production.</summary>
    public string Key { get; set; } = string.Empty;

    public int ExpiryMinutes { get; set; } = 1_440;
}

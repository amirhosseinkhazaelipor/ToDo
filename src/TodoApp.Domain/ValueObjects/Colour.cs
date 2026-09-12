using System.Text.RegularExpressions;
using TodoApp.Domain.Common;

namespace TodoApp.Domain.ValueObjects;

/// <summary>
/// Immutable value object representing an RGB colour in hexadecimal
/// notation (e.g. #1FA2FF). Invalid values can never be constructed.
/// </summary>
public sealed partial class Colour : ValueObject
{
    private Colour(string code) => Code = code;

    public string Code { get; }

    /// <summary>Factory method that validates before construction.</summary>
    /// <exception cref="DomainException">Thrown when the code is not a valid hex colour.</exception>
    public static Colour From(string code)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(code);

        if (!HexPattern().IsMatch(code))
        {
            throw new DomainException($"'{code}' is not a valid colour code (expected format: #RRGGBB).");
        }

        return new Colour(code.ToUpperInvariant());
    }

    public static bool IsValid(string code) =>
        !string.IsNullOrWhiteSpace(code) && HexPattern().IsMatch(code);

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Code;
    }

    [GeneratedRegex("^#(?:[0-9a-fA-F]{3}){1,2}$")]
    private static partial Regex HexPattern();
}

using TodoApp.Domain.Common;
using TodoApp.Domain.ValueObjects;
using Xunit;

namespace TodoApp.UnitTests.Domain;

public class ColourTests
{
    [Theory]
    [InlineData("#1FA2FF")]
    [InlineData("#fff")]
    [InlineData("#abc123")]
    public void From_WithValidHexCode_ReturnsNormalisedColour(string code)
    {
        var colour = Colour.From(code);

        colour.Code.Should().Be(code.ToUpperInvariant());
    }

    [Theory]
    [InlineData("1FA2FF")]
    [InlineData("#1FA2F")]
    [InlineData("#1FA2FF0")]
    [InlineData("green")]
    public void From_WithInvalidCode_ThrowsDomainException(string code)
    {
        var act = () => Colour.From(code);

        act.Should().Throw<DomainException>();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void From_WithNullOrWhiteSpace_ThrowsArgumentException(string? code)
    {
        var act = () => Colour.From(code!);

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void From_WithNull_ThrowsArgumentException()
    {
        var act = () => Colour.From(null!);

        act.Should().Throw<ArgumentNullException>();
    }

    [Fact]
    public void ValueEquality_SameCode_ColoursAreEqual()
    {
        var first = Colour.From("#1FA2FF");
        var second = Colour.From("#1fa2ff");

        (first == second).Should().BeTrue("value objects compare by value, not reference");
        first.Equals(second).Should().BeTrue();
        first.GetHashCode().Should().Be(second.GetHashCode());
    }

    [Fact]
    public void ValueEquality_DifferentCodes_ColoursAreNotEqual()
    {
        var first = Colour.From("#1FA2FF");
        var second = Colour.From("#FF5733");

        (first != second).Should().BeTrue();
        first.Equals(second).Should().BeFalse();
    }
}

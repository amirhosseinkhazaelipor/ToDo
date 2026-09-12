namespace TodoApp.Application.Common.Interfaces;

/// <summary>
/// Abstraction over the system clock so time-dependent logic can be tested
/// deterministically (Dependency Inversion Principle).
/// </summary>
public interface IDateTime
{
    DateTime NowUtc { get; }
}

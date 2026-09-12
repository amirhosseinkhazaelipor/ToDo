using TodoApp.Application.Common.Interfaces;

namespace TodoApp.Infrastructure.Services;

/// <summary>
/// Production implementation of <see cref="IDateTime"/>.
/// </summary>
public sealed class DateTimeService : IDateTime
{
    public DateTime NowUtc => DateTime.UtcNow;
}

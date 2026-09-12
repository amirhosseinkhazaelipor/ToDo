namespace TodoApp.Application.Common.Dtos;

/// <summary>Compact representation of a todo list used in paged collections.</summary>
public sealed record TodoListSummaryDto(
    Guid Id,
    string Title,
    string Colour,
    int ItemCount,
    DateTime CreatedAtUtc);

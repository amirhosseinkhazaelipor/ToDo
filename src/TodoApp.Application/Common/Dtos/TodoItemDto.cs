namespace TodoApp.Application.Common.Dtos;

/// <summary>
/// Data transfer object for a todo item. The API contract is intentionally
/// decoupled from the domain entity (DTO principle): Priority is exposed as a
/// human-readable string instead of the domain enum.
/// </summary>
public sealed record TodoItemDto(
    Guid Id,
    Guid ListId,
    string Title,
    string? Note,
    string Priority,
    DateTime? DueDateUtc,
    bool Done,
    DateTime? CompletedAtUtc);

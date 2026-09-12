namespace TodoApp.Application.Common.Dtos;

/// <summary>Full representation of a todo list, including its items.</summary>
public sealed record TodoListDto(
    Guid Id,
    string Title,
    string Colour,
    DateTime CreatedAtUtc,
    IReadOnlyList<TodoItemDto> Items);

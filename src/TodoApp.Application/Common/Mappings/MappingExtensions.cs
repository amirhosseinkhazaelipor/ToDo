using TodoApp.Application.Common.Dtos;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Common.Mappings;

/// <summary>
/// Explicit, testable mappings between domain entities and DTOs. Chosen over
/// reflection-based mapper libraries to keep the contract obvious and debuggable.
/// </summary>
public static class MappingExtensions
{
    public static TodoListDto ToDto(this TodoList list) =>
        new(
            list.Id,
            list.Title,
            list.Colour.Code,
            list.CreatedAtUtc,
            [.. list.Items.Select(item => item.ToDto())]);

    public static TodoListSummaryDto ToSummaryDto(this TodoList list) =>
        new(list.Id, list.Title, list.Colour.Code, list.Items.Count, list.CreatedAtUtc);

    public static TodoItemDto ToDto(this TodoItem item) =>
        new(
            item.Id,
            item.ListId,
            item.Title,
            item.Note,
            item.Priority.ToString(),
            item.DueDateUtc,
            item.Done,
            item.CompletedAtUtc);
}

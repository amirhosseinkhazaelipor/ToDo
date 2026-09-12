namespace TodoApp.Application.Common.Models;

/// <summary>
/// Standard envelope for paginated query results.
/// </summary>
public sealed class PaginatedList<T>(IReadOnlyList<T> items, int totalCount, int pageNumber, int pageSize)
{
    public IReadOnlyList<T> Items { get; } = items;

    public int PageNumber { get; } = pageNumber;

    public int PageSize { get; } = pageSize;

    public int TotalCount { get; } = totalCount;

    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling(TotalCount / (double)PageSize) : 0;

    public bool HasPreviousPage => PageNumber > 1;

    public bool HasNextPage => PageNumber < TotalPages;
}

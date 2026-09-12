using NSubstitute;
using TodoApp.Application.Common.Dtos;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Application.Common.Models;
using TodoApp.Application.Common.Specifications;
using TodoApp.Application.TodoItems.Queries.GetTodoItems;
using TodoApp.Domain.Constants;
using TodoApp.Domain.Entities;
using TodoApp.Domain.ValueObjects;

namespace TodoApp.UnitTests.Application.TodoItems;

public class GetTodoItemsQueryHandlerTests
{
    private static readonly DateTime UtcNow = new(2026, 9, 4, 10, 0, 0, DateTimeKind.Utc);

    private readonly ITodoItemRepository _repository = Substitute.For<ITodoItemRepository>();
    private readonly IDateTime _dateTime = Substitute.For<IDateTime>();
    private readonly GetTodoItemsQueryHandler _handler;

    public GetTodoItemsQueryHandlerTests()
    {
        _dateTime.NowUtc.Returns(UtcNow);
        _handler = new GetTodoItemsQueryHandler(_repository, _dateTime);
    }

    [Fact]
    public async Task Handle_MapsItemsAndPaginationMetadata()
    {
        var overdueItem = new TodoItem(Guid.NewGuid(), "Pay bill", PriorityLevel.High, null, UtcNow.AddDays(-1));
        var (items, totalCount) = (new[] { overdueItem }.AsReadOnly(), 7);
        _repository.GetPagedAsync(Arg.Any<ISpecification<TodoItem>?>(), 2, 5, Arg.Any<CancellationToken>())
            .Returns((items, totalCount));

        var result = await _handler.Handle(new GetTodoItemsQuery(PageNumber: 2, PageSize: 5, Overdue: true), CancellationToken.None);

        result.Should().BeOfType<PaginatedList<TodoItemDto>>();
        result.TotalCount.Should().Be(7);
        result.PageNumber.Should().Be(2);
        result.PageSize.Should().Be(5);
        result.TotalPages.Should().Be(2);
        result.Items.Should().ContainSingle().Which.Should().Match<TodoItemDto>(dto =>
            dto.Title == "Pay bill"
            && dto.Priority == nameof(PriorityLevel.High)
            && dto.Done == false
            && dto.DueDateUtc == UtcNow.AddDays(-1));
    }

    [Fact]
    public async Task Handle_WithNoFilters_ReturnsEverythingTheRepositoryProvides()
    {
        _repository.GetPagedAsync(null, 1, 20, Arg.Any<CancellationToken>())
            .Returns(([], 0));

        var result = await _handler.Handle(new GetTodoItemsQuery(), CancellationToken.None);

        result.Items.Should().BeEmpty();
        result.TotalCount.Should().Be(0);
        result.HasNextPage.Should().BeFalse();
    }
}

using NSubstitute;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Application.TodoItems.Commands.CompleteTodoItem;
using TodoApp.Domain.Constants;
using TodoApp.Domain.Entities;

namespace TodoApp.UnitTests.Application.TodoItems;

public class CompleteTodoItemCommandHandlerTests
{
    private static readonly DateTime UtcNow = new(2026, 9, 4, 15, 0, 0, DateTimeKind.Utc);

    private readonly ITodoItemRepository _repository = Substitute.For<ITodoItemRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly IDateTime _dateTime = Substitute.For<IDateTime>();
    private readonly CompleteTodoItemCommandHandler _handler;

    public CompleteTodoItemCommandHandlerTests()
    {
        _dateTime.NowUtc.Returns(UtcNow);
        _handler = new CompleteTodoItemCommandHandler(_repository, _unitOfWork, _dateTime);
    }

    [Fact]
    public async Task Handle_WhenItemExists_CompletesItAndSaves()
    {
        var todoItem = new TodoItem(Guid.NewGuid(), "Buy milk", PriorityLevel.High);
        _repository.GetByIdAsync(todoItem.Id, Arg.Any<CancellationToken>()).Returns(todoItem);

        await _handler.Handle(new CompleteTodoItemCommand(todoItem.Id), CancellationToken.None);

        todoItem.Done.Should().BeTrue();
        todoItem.CompletedAtUtc.Should().Be(UtcNow);
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_WhenItemDoesNotExist_ThrowsNotFound()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((TodoItem?)null);

        var act = () => _handler.Handle(new CompleteTodoItemCommand(Guid.NewGuid()), CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        await _unitOfWork.DidNotReceiveWithAnyArgs().SaveChangesAsync(default);
    }
}

using NSubstitute;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Application.TodoItems.Commands.CreateTodoItem;
using TodoApp.Domain.Constants;
using TodoApp.Domain.Entities;
using TodoApp.Domain.Events;
using TodoApp.Domain.ValueObjects;

namespace TodoApp.UnitTests.Application.TodoItems;

public class CreateTodoItemCommandHandlerTests
{
    private readonly ITodoListRepository _listRepository = Substitute.For<ITodoListRepository>();
    private readonly ITodoItemRepository _itemRepository = Substitute.For<ITodoItemRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly CreateTodoItemCommandHandler _handler;

    public CreateTodoItemCommandHandlerTests()
    {
        _handler = new CreateTodoItemCommandHandler(_listRepository, _itemRepository, _unitOfWork);
    }

    [Fact]
    public async Task Handle_WhenListExists_CreatesItemThroughAggregateAndReturnsItsId()
    {
        var todoList = new TodoList("Home", Colour.From("#FFFFFF"));
        _listRepository.GetByIdWithItemsAsync(todoList.Id, Arg.Any<CancellationToken>()).Returns(todoList);

        var result = await _handler.Handle(
            new CreateTodoItemCommand(todoList.Id, "Buy milk", null, PriorityLevel.High, null),
            CancellationToken.None);

        result.Should().NotBe(Guid.Empty);
        todoList.Items.Should().ContainSingle().Which.Id.Should().Be(result);
        todoList.DomainEvents.Should().Contain(e => e is TodoItemCreatedEvent);

        await _itemRepository.Received(1).AddAsync(
            Arg.Is<TodoItem>(item => item.Id == result && item.Title == "Buy milk"),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_WhenListDoesNotExist_ThrowsNotFound()
    {
        _listRepository.GetByIdWithItemsAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns((TodoList?)null);

        var act = () => _handler.Handle(
            new CreateTodoItemCommand(Guid.NewGuid(), "Buy milk", null, PriorityLevel.Low, null),
            CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        await _unitOfWork.DidNotReceiveWithAnyArgs().SaveChangesAsync(default);
    }
}

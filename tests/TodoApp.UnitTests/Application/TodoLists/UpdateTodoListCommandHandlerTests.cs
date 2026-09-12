using NSubstitute;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Application.TodoLists.Commands.UpdateTodoList;
using TodoApp.Domain.Entities;
using TodoApp.Domain.ValueObjects;

namespace TodoApp.UnitTests.Application.TodoLists;

public class UpdateTodoListCommandHandlerTests
{
    private readonly ITodoListRepository _repository = Substitute.For<ITodoListRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly UpdateTodoListCommandHandler _handler;

    public UpdateTodoListCommandHandlerTests()
    {
        _handler = new UpdateTodoListCommandHandler(_repository, _unitOfWork);
    }

    [Fact]
    public async Task Handle_WhenListExists_UpdatesDetailsAndSaves()
    {
        var todoList = new TodoList("Old title", Colour.From("#FFFFFF"));
        _repository.GetByIdAsync(todoList.Id, Arg.Any<CancellationToken>()).Returns(todoList);

        await _handler.Handle(new UpdateTodoListCommand(todoList.Id, "New title", "#000000"), CancellationToken.None);

        todoList.Title.Should().Be("New title");
        todoList.Colour.Code.Should().Be("#000000");
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_WhenListDoesNotExist_ThrowsNotFoundAndDoesNotSave()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((TodoList?)null);

        var act = () => _handler.Handle(new UpdateTodoListCommand(Guid.NewGuid(), "X", "#000000"), CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        await _unitOfWork.DidNotReceiveWithAnyArgs().SaveChangesAsync(default);
    }
}

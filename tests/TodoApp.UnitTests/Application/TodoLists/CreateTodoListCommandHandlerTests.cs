using NSubstitute;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Application.TodoLists.Commands.CreateTodoList;
using TodoApp.Domain.Entities;

namespace TodoApp.UnitTests.Application.TodoLists;

public class CreateTodoListCommandHandlerTests
{
    private readonly ITodoListRepository _repository = Substitute.For<ITodoListRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly CreateTodoListCommandHandler _handler;

    public CreateTodoListCommandHandlerTests()
    {
        _handler = new CreateTodoListCommandHandler(_repository, _unitOfWork);
    }

    [Fact]
    public async Task Handle_WithValidCommand_PersistsListAndReturnsItsId()
    {
        TodoList? captured = null;
        await _repository.AddAsync(Arg.Do<TodoList>(list => captured = list), Arg.Any<CancellationToken>());

        var result = await _handler.Handle(new CreateTodoListCommand("Home", "#1FA2FF"), CancellationToken.None);

        result.Should().NotBe(Guid.Empty);
        captured.Should().NotBeNull();
        captured!.Title.Should().Be("Home");
        captured.Colour.Code.Should().Be("#1FA2FF");

        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }
}

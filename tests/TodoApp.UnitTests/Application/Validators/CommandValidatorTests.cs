using FluentValidation.TestHelper;
using TodoApp.Application.TodoLists.Commands.CreateTodoList;
using TodoApp.Application.TodoItems.Commands.CreateTodoItem;
using TodoApp.Domain.Constants;

namespace TodoApp.UnitTests.Application.Validators;

public class CommandValidatorTests
{
    private readonly CreateTodoListCommandValidator _listValidator = new();
    private readonly CreateTodoItemCommandValidator _itemValidator = new();

    [Fact]
    public void CreateTodoList_WithValidCommand_Passes()
    {
        var command = new CreateTodoListCommand("Home", "#1FA2FF");

        var result = _listValidator.TestValidate(command);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void CreateTodoList_WithEmptyTitle_Fails(string? title)
    {
        var result = _listValidator.TestValidate(new CreateTodoListCommand(title!, "#1FA2FF"));

        result.ShouldHaveValidationErrorFor(command => command.Title);
    }

    [Fact]
    public void CreateTodoList_WithInvalidColour_Fails()
    {
        var result = _listValidator.TestValidate(new CreateTodoListCommand("Home", "green"));

        result.ShouldHaveValidationErrorFor(command => command.Colour);
    }

    [Fact]
    public void CreateTodoItem_WithValidCommand_Passes()
    {
        var command = new CreateTodoItemCommand(Guid.NewGuid(), "Buy milk", "note", PriorityLevel.High, null);

        var result = _itemValidator.TestValidate(command);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void CreateTodoItem_WithEmptyListId_Fails()
    {
        var command = new CreateTodoItemCommand(Guid.Empty, "Buy milk", null, PriorityLevel.High, null);

        var result = _itemValidator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(command => command.ListId);
    }

    [Fact]
    public void CreateTodoItem_WithOutOfRangePriority_Fails()
    {
        var command = new CreateTodoItemCommand(Guid.NewGuid(), "Buy milk", null, (PriorityLevel)99, null);

        var result = _itemValidator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(command => command.Priority);
    }
}

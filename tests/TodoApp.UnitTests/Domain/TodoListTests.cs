using TodoApp.Domain.Entities;
using TodoApp.Domain.Events;
using TodoApp.Domain.Common;
using TodoApp.Domain.Constants;
using TodoApp.Domain.ValueObjects;
using Xunit;

namespace TodoApp.UnitTests.Domain;

public class TodoListTests
{
    private static readonly Colour AnyColour = Colour.From("#1FA2FF");

    [Fact]
    public void Constructor_WithValidData_InitialisesProperties()
    {
        var list = new TodoList("  Home  ", AnyColour);

        list.Title.Should().Be("Home");
        list.Colour.Should().Be(AnyColour);
        list.Items.Should().BeEmpty();
    }

    [Fact]
    public void Constructor_WithEmptyTitle_ThrowsDomainException()
    {
        var act = () => new TodoList("   ", AnyColour);

        act.Should().Throw<DomainException>().WithMessage("*title is required*");
    }

    [Fact]
    public void Constructor_WithTooLongTitle_ThrowsDomainException()
    {
        var title = new string('x', TodoList.MaxTitleLength + 1);

        var act = () => new TodoList(title, AnyColour);

        act.Should().Throw<DomainException>().WithMessage("*cannot exceed*");
    }

    [Fact]
    public void UpdateDetails_ChangesTitleAndColour()
    {
        var list = new TodoList("Home", AnyColour);
        var newColour = Colour.From("#FF5733");

        list.UpdateDetails("Work", newColour);

        list.Title.Should().Be("Work");
        list.Colour.Should().Be(newColour);
    }

    [Fact]
    public void AddItem_AddsItemToAggregateCollection()
    {
        var list = new TodoList("Home", AnyColour);

        var item = list.AddItem("Buy milk", PriorityLevel.High, note: "2 liters", dueDateUtc: null);

        list.Items.Should().ContainSingle();
        list.Items.Single().Should().Be(item);
        item.ListId.Should().Be(list.Id);
    }

    [Fact]
    public void AddItem_RaisesTodoItemCreatedEvent()
    {
        var list = new TodoList("Home", AnyColour);

        list.AddItem("Buy milk", PriorityLevel.Medium);

        list.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<TodoItemCreatedEvent>();
    }

    [Fact]
    public void RemoveItem_RemovesTheItem()
    {
        var list = new TodoList("Home", AnyColour);
        var item = list.AddItem("Buy milk", PriorityLevel.Low);

        list.RemoveItem(item.Id);

        list.Items.Should().BeEmpty();
    }

    [Fact]
    public void RemoveItem_WithUnknownId_ThrowsDomainException()
    {
        var list = new TodoList("Home", AnyColour);

        var act = () => list.RemoveItem(Guid.NewGuid());

        act.Should().Throw<DomainException>().WithMessage("*does not belong*");
    }
}

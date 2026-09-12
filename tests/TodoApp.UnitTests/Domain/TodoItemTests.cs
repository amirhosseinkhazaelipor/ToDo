using TodoApp.Domain.Common;
using TodoApp.Domain.Constants;
using TodoApp.Domain.Entities;
using TodoApp.Domain.Events;
using Xunit;

namespace TodoApp.UnitTests.Domain;

public class TodoItemTests
{
    private static readonly DateTime UtcNow = new(2026, 9, 4, 12, 0, 0, DateTimeKind.Utc);

    private static TodoItem CreateItem() =>
        new(Guid.NewGuid(), "Buy milk", PriorityLevel.High, note: "2 liters", dueDateUtc: null);

    [Fact]
    public void Constructor_TrimsTitle()
    {
        var item = new TodoItem(Guid.NewGuid(), "  Buy milk  ", PriorityLevel.Low);

        item.Title.Should().Be("Buy milk");
        item.Done.Should().BeFalse();
        item.CompletedAtUtc.Should().BeNull();
    }

    [Fact]
    public void Constructor_WithEmptyTitle_ThrowsDomainException()
    {
        var act = () => new TodoItem(Guid.NewGuid(), "", PriorityLevel.None);

        act.Should().Throw<DomainException>().WithMessage("*title is required*");
    }

    [Fact]
    public void UpdateDetails_UpdatesAllMutableFields()
    {
        var item = CreateItem();
        var dueDate = UtcNow.AddDays(7);

        item.UpdateDetails("Buy oat milk", "barista edition", PriorityLevel.Medium, dueDate);

        item.Title.Should().Be("Buy oat milk");
        item.Note.Should().Be("barista edition");
        item.Priority.Should().Be(PriorityLevel.Medium);
        item.DueDateUtc.Should().Be(dueDate);
    }

    [Fact]
    public void Complete_MarksItemDoneAndStampsCompletionTime()
    {
        var item = CreateItem();

        item.Complete(UtcNow);

        item.Done.Should().BeTrue();
        item.CompletedAtUtc.Should().Be(UtcNow);
    }

    [Fact]
    public void Complete_RaisesTodoItemCompletedEvent()
    {
        var item = CreateItem();

        item.Complete(UtcNow);

        item.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<TodoItemCompletedEvent>();
    }

    [Fact]
    public void Complete_WhenAlreadyDone_IsIdempotent()
    {
        var item = CreateItem();
        item.Complete(UtcNow);
        item.ClearDomainEvents();

        item.Complete(UtcNow.AddMinutes(5));

        item.CompletedAtUtc.Should().Be(UtcNow, "a completed item must not be completed twice");
        item.DomainEvents.Should().BeEmpty();
    }

    [Fact]
    public void Reopen_ClearsCompletionState()
    {
        var item = CreateItem();
        item.Complete(UtcNow);

        item.Reopen();

        item.Done.Should().BeFalse();
        item.CompletedAtUtc.Should().BeNull();
    }
}

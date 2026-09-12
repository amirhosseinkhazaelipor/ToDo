using System.Linq.Expressions;
using TodoApp.Application.Common.Specifications;
using TodoApp.Domain.Constants;
using TodoApp.Domain.Entities;

namespace TodoApp.UnitTests.Application.Specifications;

public class SpecificationTests
{
    private static readonly DateTime UtcNow = new(2026, 9, 4, 10, 0, 0, DateTimeKind.Utc);

    [Fact]
    public void OverdueSpecification_MatchesOnlyOpenItemsPastTheirDueDate()
    {
        var specification = new OverdueTodoItemSpecification(UtcNow);
        var overdue = new TodoItem(Guid.NewGuid(), "overdue", PriorityLevel.High, null, UtcNow.AddDays(-1));
        var done = new TodoItem(Guid.NewGuid(), "done", PriorityLevel.High, null, UtcNow.AddDays(-1));
        done.Complete(UtcNow);
        var notDueYet = new TodoItem(Guid.NewGuid(), "future", PriorityLevel.High, null, UtcNow.AddDays(1));
        var noDueDate = new TodoItem(Guid.NewGuid(), "no date", PriorityLevel.High);

        var matches = Matches(specification.ToExpression(), [overdue, done, notDueYet, noDueDate]);

        matches.Should().ContainSingle().Which.Should().Be(overdue);
    }

    [Fact]
    public void And_CombinesSpecificationsWithLogicalAnd()
    {
        var listA = Guid.NewGuid();
        var listB = Guid.NewGuid();

        var specification = new TodoItemIsDoneSpecification(false)
            .And(new TodoItemByListSpecification(listA));

        var openInListA = new TodoItem(listA, "open A", PriorityLevel.None);
        var doneInListA = new TodoItem(listA, "done A", PriorityLevel.None);
        doneInListA.Complete(UtcNow);
        var openInListB = new TodoItem(listB, "open B", PriorityLevel.None);

        var matches = Matches(specification.ToExpression(), [openInListA, doneInListA, openInListB]);

        matches.Should().ContainSingle().Which.Should().Be(openInListA);
    }

    [Fact]
    public void Or_CombinesSpecificationsWithLogicalOr()
    {
        var specification = new TodoItemByPrioritySpecification(PriorityLevel.High)
            .Or(new TodoItemIsDoneSpecification(true));
        var highOpen = new TodoItem(Guid.NewGuid(), "high", PriorityLevel.High);
        var doneLow = new TodoItem(Guid.NewGuid(), "done low", PriorityLevel.Low);
        doneLow.Complete(UtcNow);
        var lowOpen = new TodoItem(Guid.NewGuid(), "low open", PriorityLevel.Low);

        var matches = Matches(specification.ToExpression(), [highOpen, doneLow, lowOpen]);

        matches.Should().BeEquivalentTo([highOpen, doneLow]);
    }

    [Fact]
    public void TitleContains_IsCaseInsensitive()
    {
        var specification = new TodoItemTitleContainsSpecification("MILK");
        var item = new TodoItem(Guid.NewGuid(), "Buy milk", PriorityLevel.None);

        Matches(specification.ToExpression(), [item]).Should().Contain(item);
    }

    private static List<T> Matches<T>(Expression<Func<T, bool>> predicate, IReadOnlyList<T> source) =>
        [.. source.Where(predicate.Compile())];
}

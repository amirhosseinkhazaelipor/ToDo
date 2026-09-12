using MediatR;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Common;
using TodoApp.Domain.Constants;
using TodoApp.Domain.Entities;
using TodoApp.Domain.Events;
using TodoApp.Domain.ValueObjects;
using TodoApp.Infrastructure.Persistence;
using TodoApp.Infrastructure.Persistence.Interceptors;

namespace TodoApp.UnitTests.Persistence;

/// <summary>
/// Persistence tests against a real database engine (SQLite in-memory),
/// verifying EF mappings, cascade delete, auditing and domain-event dispatch.
/// </summary>
public class ApplicationDbContextTests
{
    private static readonly DateTime UtcNow = new(2026, 9, 4, 10, 0, 0, DateTimeKind.Utc);

    [Fact]
    public async Task SaveChanges_PersistsAggregateAndDispatchesDomainEvents()
    {
        var connection = NewOpenConnection();
        var dispatcher = new SpyMediator();
        await using var dbContext = CreateContext(connection, dispatcher);

        var list = new TodoList("Home", Colour.From("#1FA2FF"));
        list.AddItem("Buy milk", PriorityLevel.High);
        dbContext.TodoLists.Add(list);

        await dbContext.SaveChangesAsync();

        list.DomainEvents.Should().BeEmpty("events are cleared once dispatched");
        dispatcher.Published.Should().ContainSingle().Which.Should().BeOfType<TodoItemCreatedEvent>();

        var reloaded = await dbContext.TodoLists
            .Include(l => l.Items)
            .SingleAsync();
        reloaded.Title.Should().Be("Home");
        reloaded.Colour.Code.Should().Be("#1FA2FF");
        reloaded.CreatedAtUtc.Should().Be(UtcNow, "the audit interceptor must stamp creation time");
        reloaded.Items.Single().Title.Should().Be("Buy milk");
    }

    [Fact]
    public async Task SaveChanges_CompletingItemPublishesCompletedEvent()
    {
        var connection = NewOpenConnection();
        var dispatcher = new SpyMediator();
        await using var dbContext = CreateContext(connection, dispatcher);

        var list = new TodoList("Home", Colour.From("#FFFFFF"));
        var item = list.AddItem("Buy milk", PriorityLevel.None);
        dbContext.TodoLists.Add(list);
        await dbContext.SaveChangesAsync();
        dispatcher.Published.Clear();

        item.Complete(UtcNow);
        await dbContext.SaveChangesAsync();

        dispatcher.Published.Should().ContainSingle().Which.Should().BeOfType<TodoItemCompletedEvent>();
        var reloadedItem = await dbContext.TodoItems.SingleAsync();
        reloadedItem.Done.Should().BeTrue();
        reloadedItem.CompletedAtUtc.Should().Be(UtcNow);
    }

    [Fact]
    public async Task DeleteList_CascadesToItsItems()
    {
        var connection = NewOpenConnection();
        var dispatcher = new SpyMediator();
        await using var dbContext = CreateContext(connection, dispatcher);

        var list = new TodoList("Home", Colour.From("#FFFFFF"));
        list.AddItem("one", PriorityLevel.None);
        list.AddItem("two", PriorityLevel.None);
        dbContext.TodoLists.Add(list);
        await dbContext.SaveChangesAsync();

        dbContext.TodoLists.Remove(list);
        await dbContext.SaveChangesAsync();

        dbContext.TodoItems.Should().BeEmpty("items are deleted together with their aggregate root");
        (await dbContext.TodoLists.ToListAsync()).Should().BeEmpty();
    }

    [Fact]
    public async Task SaveColors_RoundTripsThroughValueConverter()
    {
        var connection = new SqliteConnection("DataSource=:memory:");
        connection.Open();

        var dispatcher = new SpyMediator();

        await using (var dbContext = CreateContext(connection, dispatcher))
        {
            dbContext.TodoLists.Add(new TodoList("Home", Colour.From("#abc123")));
            await dbContext.SaveChangesAsync();
        }

        await using var secondContext = CreateContext(connection, dispatcher);
        var reloaded = await secondContext.Set<TodoList>().SingleAsync();

        reloaded.Colour.Should().Be(Colour.From("#ABC123"));
    }

    private static SqliteConnection NewOpenConnection()
    {
        var connection = new SqliteConnection("DataSource=:memory:");
        connection.Open();

        return connection;
    }

    private static ApplicationDbContext CreateContext(SqliteConnection connection, SpyMediator mediator)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite(connection)
            .AddInterceptors(
                new AuditableEntityInterceptor(new FrozenDateTime()),
                new DispatchDomainEventsInterceptor(mediator))
            .Options;

        var context = new ApplicationDbContext(options);
        context.Database.EnsureCreated();

        return context;
    }

    private sealed class FrozenDateTime : IDateTime
    {
        public DateTime NowUtc => UtcNow;
    }

    /// <summary>Records published notifications instead of invoking handlers.</summary>
    private sealed class SpyMediator : IMediator
    {
        public List<INotification> Published { get; } = [];

        public Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default) =>
            throw new NotSupportedException("SpyMediator only records published notifications.");

        public Task Send<TRequest>(TRequest request, CancellationToken cancellationToken = default)
            where TRequest : IRequest =>
            throw new NotSupportedException("SpyMediator only records published notifications.");

        public Task Send(IRequest request, CancellationToken cancellationToken = default) =>
            throw new NotSupportedException("SpyMediator only records published notifications.");

        public Task<object?> Send(object request, CancellationToken cancellationToken = default) =>
            throw new NotSupportedException("SpyMediator only records published notifications.");

        public IAsyncEnumerable<TResponse> CreateStream<TResponse>(IStreamRequest<TResponse> request, CancellationToken cancellationToken = default) =>
            throw new NotSupportedException("SpyMediator only records published notifications.");

        public IAsyncEnumerable<object?> CreateStream(object request, CancellationToken cancellationToken = default) =>
            throw new NotSupportedException("SpyMediator only records published notifications.");

        public Task Publish<TNotification>(TNotification notification, CancellationToken cancellationToken = default)
            where TNotification : INotification
        {
            Published.Add(notification);
            return Task.CompletedTask;
        }

        public Task Publish(object notification, CancellationToken cancellationToken = default) =>
            throw new NotSupportedException("SpyMediator only records published notifications.");
    }
}

using MediatR;
using Microsoft.Extensions.Logging;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Events;

namespace TodoApp.Application.TodoItems.EventHandlers;

/// <summary>
/// Observer-pattern handler: reacts to <see cref="TodoItemCompletedEvent"/>
/// raised by the domain. Side-effect free application logic such as
/// notifications lives here — not in the domain model and not in controllers.
/// </summary>
public sealed class TodoItemCompletedEventHandler(IEmailSender emailSender, ILogger<TodoItemCompletedEventHandler> logger)
    : INotificationHandler<TodoItemCompletedEvent>
{
    public async Task Handle(TodoItemCompletedEvent notification, CancellationToken cancellationToken)
    {
        logger.LogInformation("Todo item {ItemId} was completed; sending a notification.", notification.Item.Id);

        await emailSender.SendAsync($"Well done! You completed: {notification.Item.Title}", cancellationToken);
    }
}

using MediatR;

namespace TodoApp.Domain.Common;

/// <summary>
/// Marker base class for domain events. Derives from MediatR's INotification
/// (via the dependency-free MediatR.Contracts package) so events raised by the
/// domain can be published by a mediator in the outer layers.
/// </summary>
public abstract class BaseEvent : INotification
{
}

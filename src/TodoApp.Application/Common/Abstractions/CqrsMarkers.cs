using MediatR;

namespace TodoApp.Application.Common.Abstractions;

/// <summary>
/// Marker interfaces that classify MediatR requests as CQRS commands or queries.
/// The transaction pipeline behaviour uses them to decide whether a database
/// transaction is required.
/// </summary>
public interface ICommand : IRequest
{
}

public interface ICommand<TResponse> : IRequest<TResponse>
{
}

public interface IQuery<TResponse> : IRequest<TResponse>
{
}

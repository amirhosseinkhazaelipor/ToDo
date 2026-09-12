namespace TodoApp.Application.Common.Exceptions;

/// <summary>
/// Thrown by handlers when a requested resource does not exist. The API layer
/// maps it to an HTTP 404 ProblemDetails response.
/// </summary>
public sealed class NotFoundException(string name, object key)
    : Exception($"Entity \"{name}\" ({key}) was not found.");

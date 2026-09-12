namespace TodoApp.Domain.Common;

/// <summary>
/// Raised when a business rule of the domain is violated. The API layer maps
/// it to an HTTP 400 ProblemDetails response.
/// </summary>
public class DomainException(string message) : Exception(message);

using TodoApp.Domain.Common;

namespace TodoApp.Application.Common.Exceptions;

/// <summary>
/// Raised when a use-case rule is violated (e.g. duplicate email, wrong
/// credentials). Mapped to HTTP 400 with the message exposed as ProblemDetails
/// detail so the UI can show it to the user.
/// </summary>
public sealed class DomainRuleViolationException(string message) : DomainException(message);

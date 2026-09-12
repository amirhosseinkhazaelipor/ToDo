using Microsoft.Extensions.Logging;
using TodoApp.Application.Common.Interfaces;

namespace TodoApp.Infrastructure.Services;

/// <summary>
/// Demo implementation of <see cref="IEmailSender"/>: writes to the log
/// instead of calling a real provider. Swap this for SMTP/SendGrid in
/// production without touching any other layer (Dependency Inversion).
/// </summary>
public sealed class EmailSender(ILogger<EmailSender> logger) : IEmailSender
{
    public Task SendAsync(string message, CancellationToken cancellationToken)
    {
        logger.LogInformation("Email sent: {Message}", message);

        return Task.CompletedTask;
    }
}

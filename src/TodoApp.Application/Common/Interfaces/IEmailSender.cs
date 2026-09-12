namespace TodoApp.Application.Common.Interfaces;

/// <summary>
/// Abstraction over outbound notifications. The Application layer only knows
/// the intent; Infrastructure decides how e-mails are actually delivered.
/// </summary>
public interface IEmailSender
{
    Task SendAsync(string message, CancellationToken cancellationToken);
}

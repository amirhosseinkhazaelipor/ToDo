using MediatR;
using Microsoft.Extensions.Logging;
using TodoApp.Application.Common.Abstractions;
using TodoApp.Infrastructure.Persistence;

namespace TodoApp.Infrastructure.Common.Behaviors;

/// <summary>
/// Wraps every command in an explicit database transaction. Queries pass
/// straight through: they never need a transaction. This behaviour lives in
/// Infrastructure because transactions are a persistence concern.
/// </summary>
public sealed class TransactionBehavior<TRequest, TResponse>(
    ApplicationDbContext dbContext,
    ILogger<TransactionBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (request is not ICommand)
        {
            return await next();
        }

        var requestName = typeof(TRequest).Name;

        logger.LogDebug("Beginning transaction for {RequestName}", requestName);

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            var response = await next();

            await transaction.CommitAsync(cancellationToken);

            logger.LogDebug("Committed transaction for {RequestName}", requestName);

            return response;
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            logger.LogDebug("Rolled back transaction for {RequestName}", requestName);
            throw;
        }
    }
}

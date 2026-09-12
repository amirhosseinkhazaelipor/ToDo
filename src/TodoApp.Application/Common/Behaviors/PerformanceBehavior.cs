using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace TodoApp.Application.Common.Behaviors;

/// <summary>
/// Warns whenever a request takes longer than the configured threshold,
/// turning silent performance degradation into a visible signal.
/// </summary>
public sealed class PerformanceBehavior<TRequest, TResponse>(ILogger<PerformanceBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private const int SlowRequestThresholdMilliseconds = 500;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var startTimestamp = Stopwatch.GetTimestamp();

        var response = await next();

        var elapsed = Stopwatch.GetElapsedTime(startTimestamp);

        if (elapsed.TotalMilliseconds > SlowRequestThresholdMilliseconds)
        {
            logger.LogWarning(
                "{RequestName} took {ElapsedMilliseconds} ms (threshold: {ThresholdMilliseconds} ms)",
                typeof(TRequest).Name,
                elapsed.TotalMilliseconds,
                SlowRequestThresholdMilliseconds);
        }

        return response;
    }
}

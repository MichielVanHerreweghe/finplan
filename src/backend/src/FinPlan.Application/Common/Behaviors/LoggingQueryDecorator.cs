using System.Diagnostics;
using FluentResults;
using FinPlan.Application.Common.Messaging;
using Microsoft.Extensions.Logging;

namespace FinPlan.Application.Common.Behaviors;

/// <summary>Logs the execution of a query, mirroring <see cref="LoggingCommandDecorator{TCommand,TResponse}"/>.</summary>
internal sealed class LoggingQueryDecorator<TQuery, TResponse>(
    IQueryHandler<TQuery, TResponse> inner,
    ILoggerFactory loggerFactory)
    : IQueryHandler<TQuery, TResponse>
    where TQuery : IQuery<TResponse>
    where TResponse : IResultBase
{
    private readonly ILogger _logger = loggerFactory.CreateLogger(typeof(TQuery));

    public async Task<TResponse> Handle(TQuery query, CancellationToken ct)
    {
        string name = typeof(TQuery).Name;
        _logger.LogInformation("Handling query {Query}", name);

        long start = Stopwatch.GetTimestamp();
        TResponse response = await inner.Handle(query, ct);
        TimeSpan elapsed = Stopwatch.GetElapsedTime(start);

        if (response.IsFailed)
            _logger.LogWarning("Query {Query} failed in {Elapsed}ms: {Reasons}",
                name, elapsed.TotalMilliseconds, string.Join("; ", response.Errors.Select(e => e.Message)));
        else
            _logger.LogInformation("Query {Query} handled in {Elapsed}ms", name, elapsed.TotalMilliseconds);

        return response;
    }
}

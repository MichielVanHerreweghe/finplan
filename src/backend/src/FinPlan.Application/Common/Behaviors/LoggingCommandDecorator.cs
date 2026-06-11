using System.Diagnostics;
using FluentResults;
using FinPlan.Application.Common.Messaging;
using Microsoft.Extensions.Logging;

namespace FinPlan.Application.Common.Behaviors;

/// <summary>
/// Logs the execution of a command: a start line, then success or the collected failure
/// reasons, with elapsed milliseconds. Logged failures are expected business outcomes,
/// so they are recorded at Warning rather than as exceptions.
/// </summary>
internal sealed class LoggingCommandDecorator<TCommand, TResponse>(
    ICommandHandler<TCommand, TResponse> inner,
    ILoggerFactory loggerFactory)
    : ICommandHandler<TCommand, TResponse>
    where TCommand : ICommand<TResponse>
    where TResponse : IResultBase
{
    private readonly ILogger _logger = loggerFactory.CreateLogger(typeof(TCommand));

    public async Task<TResponse> Handle(TCommand command, CancellationToken ct)
    {
        string name = typeof(TCommand).Name;
        _logger.LogInformation("Handling command {Command}", name);

        long start = Stopwatch.GetTimestamp();
        TResponse response = await inner.Handle(command, ct);
        TimeSpan elapsed = Stopwatch.GetElapsedTime(start);

        if (response.IsFailed)
            _logger.LogWarning("Command {Command} failed in {Elapsed}ms: {Reasons}",
                name, elapsed.TotalMilliseconds, string.Join("; ", response.Errors.Select(e => e.Message)));
        else
            _logger.LogInformation("Command {Command} handled in {Elapsed}ms", name, elapsed.TotalMilliseconds);

        return response;
    }
}

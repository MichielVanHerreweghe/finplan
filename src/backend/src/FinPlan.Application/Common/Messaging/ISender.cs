using FluentResults;

namespace FinPlan.Application.Common.Messaging;

/// <summary>
/// The single entry point for dispatching commands and queries to their handlers.
/// Resolves the matching <see cref="ICommandHandler{TCommand,TResponse}"/> /
/// <see cref="IQueryHandler{TQuery,TResponse}"/> (with its decorator pipeline) from DI.
/// </summary>
public interface ISender
{
    Task<TResponse> Send<TResponse>(ICommand<TResponse> command, CancellationToken ct = default)
        where TResponse : IResultBase;

    Task<TResponse> Send<TResponse>(IQuery<TResponse> query, CancellationToken ct = default)
        where TResponse : IResultBase;
}

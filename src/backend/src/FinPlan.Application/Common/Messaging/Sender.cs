using FluentResults;
using Microsoft.Extensions.DependencyInjection;

namespace FinPlan.Application.Common.Messaging;

/// <summary>
/// Resolves the handler for the runtime message type and invokes it. The <c>dynamic</c>
/// cast bridges the open generic boundary: the static type is only <c>ICommand&lt;T&gt;</c>,
/// but the concrete handler is registered against the closed command type, so we close the
/// handler interface over <c>command.GetType()</c> and let the runtime bind <c>Handle</c>.
/// The resolved instance is the outermost decorator (logging → validation → handler).
/// </summary>
internal sealed class Sender(IServiceProvider provider) : ISender
{
    public Task<TResponse> Send<TResponse>(ICommand<TResponse> command, CancellationToken ct = default)
        where TResponse : IResultBase
    {
        Type handlerType = typeof(ICommandHandler<,>).MakeGenericType(command.GetType(), typeof(TResponse));
        dynamic handler = provider.GetRequiredService(handlerType);
        return handler.Handle((dynamic)command, ct);
    }

    public Task<TResponse> Send<TResponse>(IQuery<TResponse> query, CancellationToken ct = default)
        where TResponse : IResultBase
    {
        Type handlerType = typeof(IQueryHandler<,>).MakeGenericType(query.GetType(), typeof(TResponse));
        dynamic handler = provider.GetRequiredService(handlerType);
        return handler.Handle((dynamic)query, ct);
    }
}

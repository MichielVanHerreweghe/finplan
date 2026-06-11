using FluentResults;

namespace FinPlan.Application.Common.Messaging;

public interface ICommandHandler<in TCommand, TResponse>
    where TCommand : ICommand<TResponse>
    where TResponse : IResultBase
{
    Task<TResponse> Handle(TCommand command, CancellationToken ct);
}

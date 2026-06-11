using FluentResults;

namespace FinPlan.Application.Common.Messaging;

public interface IQueryHandler<in TQuery, TResponse>
    where TQuery : IQuery<TResponse>
    where TResponse : IResultBase
{
    Task<TResponse> Handle(TQuery query, CancellationToken ct);
}

using FluentResults;
using FluentValidation;
using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Common.Behaviors;

/// <summary>Validates a query's input before it reaches the inner handler.</summary>
internal sealed class ValidationQueryDecorator<TQuery, TResponse>(
    IQueryHandler<TQuery, TResponse> inner,
    IEnumerable<IValidator<TQuery>> validators)
    : IQueryHandler<TQuery, TResponse>
    where TQuery : IQuery<TResponse>
    where TResponse : IResultBase
{
    public async Task<TResponse> Handle(TQuery query, CancellationToken ct)
    {
        IReadOnlyList<IError> errors = await MessageValidator.ValidateAsync(query, validators, ct);

        return errors.Count > 0
            ? ResultFactory<TResponse>.Fail(errors)
            : await inner.Handle(query, ct);
    }
}

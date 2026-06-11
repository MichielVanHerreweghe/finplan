using FluentResults;
using FluentValidation;
using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Common.Behaviors;

/// <summary>
/// Validates a command's input before it reaches the inner handler. On failure it
/// short-circuits with a failed result instead of throwing, keeping the whole pipeline
/// on the FluentResults rail (consistent with the domain's own validation).
/// </summary>
internal sealed class ValidationCommandDecorator<TCommand, TResponse>(
    ICommandHandler<TCommand, TResponse> inner,
    IEnumerable<IValidator<TCommand>> validators)
    : ICommandHandler<TCommand, TResponse>
    where TCommand : ICommand<TResponse>
    where TResponse : IResultBase
{
    public async Task<TResponse> Handle(TCommand command, CancellationToken ct)
    {
        IReadOnlyList<IError> errors = await MessageValidator.ValidateAsync(command, validators, ct);

        return errors.Count > 0
            ? ResultFactory<TResponse>.Fail(errors)
            : await inner.Handle(command, ct);
    }
}

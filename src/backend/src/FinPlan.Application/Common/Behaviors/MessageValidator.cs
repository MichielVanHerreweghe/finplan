using FluentResults;
using FluentValidation;
using FluentValidation.Results;

namespace FinPlan.Application.Common.Behaviors;

/// <summary>
/// Runs every registered <see cref="IValidator{T}"/> for a message and collects the
/// failures as FluentResults <see cref="IError"/>s. Returns an empty list when valid
/// (or when no validators are registered for the message).
/// </summary>
internal static class MessageValidator
{
    public static async Task<IReadOnlyList<IError>> ValidateAsync<TMessage>(
        TMessage message,
        IEnumerable<IValidator<TMessage>> validators,
        CancellationToken ct)
    {
        ValidationContext<TMessage> context = new(message);

        ValidationResult[] results = await Task.WhenAll(
            validators.Select(validator => validator.ValidateAsync(context, ct)));

        return results
            .SelectMany(result => result.Errors)
            .Where(failure => failure is not null)
            .Select(failure => (IError)new Error(failure.ErrorMessage)
                .WithMetadata("Property", failure.PropertyName))
            .ToList();
    }
}

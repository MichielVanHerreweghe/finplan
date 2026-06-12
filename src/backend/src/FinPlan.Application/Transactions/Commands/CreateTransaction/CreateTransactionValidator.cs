using FinPlan.Domain.Transactions;
using FluentValidation;

namespace FinPlan.Application.Transactions.Commands.CreateTransaction;

// Guards the request shape at the edge of the application. The domain's own
// Transaction.Create remains the authoritative invariant check.
public sealed class CreateTransactionValidator : AbstractValidator<CreateTransactionCommand>
{
    public CreateTransactionValidator()
    {
        RuleFor(command => command.Name).NotEmpty();
        RuleFor(command => command.Amount).GreaterThan(0);
        RuleFor(command => command.Type).NotEqual(TransactionType.Undefined);
        RuleFor(command => command.CategoryId)
            .GreaterThan(0)
            .When(command => command.CategoryId.HasValue);
        RuleFor(command => command.FromPocketId)
            .GreaterThan(0)
            .When(command => command.FromPocketId.HasValue);
        RuleFor(command => command.ToPocketId)
            .GreaterThan(0)
            .When(command => command.ToPocketId.HasValue);
        RuleFor(command => command.SavingGoalId)
            .GreaterThan(0)
            .When(command => command.SavingGoalId.HasValue);
    }
}

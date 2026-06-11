using FinPlan.Domain.Transactions;
using FluentValidation;

namespace FinPlan.Application.Transactions.Commands.UpdateTransaction;

public sealed class UpdateTransactionValidator : AbstractValidator<UpdateTransactionCommand>
{
    public UpdateTransactionValidator()
    {
        RuleFor(command => command.Id).GreaterThan(0);
        RuleFor(command => command.Name).NotEmpty();
        RuleFor(command => command.Amount).GreaterThan(0);
        RuleFor(command => command.Type).NotEqual(TransactionType.Undefined);
        RuleFor(command => command.CategoryId)
            .GreaterThan(0)
            .When(command => command.CategoryId.HasValue);
    }
}

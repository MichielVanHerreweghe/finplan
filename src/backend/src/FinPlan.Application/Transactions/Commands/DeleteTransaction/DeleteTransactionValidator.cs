using FluentValidation;

namespace FinPlan.Application.Transactions.Commands.DeleteTransaction;

public sealed class DeleteTransactionValidator : AbstractValidator<DeleteTransactionCommand>
{
    public DeleteTransactionValidator() =>
        RuleFor(command => command.Id).GreaterThan(0);
}

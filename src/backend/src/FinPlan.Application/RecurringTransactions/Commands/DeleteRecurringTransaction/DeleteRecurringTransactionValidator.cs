using FluentValidation;

namespace FinPlan.Application.RecurringTransactions.Commands.DeleteRecurringTransaction;

public sealed class DeleteRecurringTransactionValidator : AbstractValidator<DeleteRecurringTransactionCommand>
{
    public DeleteRecurringTransactionValidator() =>
        RuleFor(command => command.Id).GreaterThan(0);
}

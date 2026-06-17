using FinPlan.Domain.RecurringTransactions;
using FinPlan.Domain.Transactions;
using FluentValidation;

namespace FinPlan.Application.RecurringTransactions.Commands.CreateRecurringTransaction;

// Guards the request shape at the edge; RecurringTransaction.Create remains the authoritative
// invariant check. The RRULE is validated through the scheduler so a malformed rule is rejected
// before it can ever reach the daily job.
public sealed class CreateRecurringTransactionValidator : AbstractValidator<CreateRecurringTransactionCommand>
{
    public CreateRecurringTransactionValidator(IRecurrenceScheduler scheduler)
    {
        RuleFor(command => command.Name).NotEmpty();
        RuleFor(command => command.Amount).GreaterThan(0);
        RuleFor(command => command.Type).NotEqual(TransactionType.Undefined);
        RuleFor(command => command.RecurrenceRule)
            .NotEmpty()
            .Must(scheduler.IsValid)
            .WithMessage("Invalid recurrence rule.");
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

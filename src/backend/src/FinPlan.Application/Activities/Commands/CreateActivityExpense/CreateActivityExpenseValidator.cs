using FinPlan.Domain.Activities;
using FluentValidation;

namespace FinPlan.Application.Activities.Commands.CreateActivityExpense;

// Guards the request shape; ActivityExpense.Create remains the authoritative check on how the
// split resolves (amounts add up, percentages total 100, etc).
public sealed class CreateActivityExpenseValidator : AbstractValidator<CreateActivityExpenseCommand>
{
    public CreateActivityExpenseValidator()
    {
        RuleFor(command => command.ActivityId).GreaterThan(0);
        RuleFor(command => command.Description).NotEmpty();
        RuleFor(command => command.Amount).GreaterThan(0);
        RuleFor(command => command.PaidByUserId).GreaterThan(0);
        RuleFor(command => command.SplitType).NotEqual(SplitType.Undefined);
        RuleFor(command => command.Splits).NotEmpty();
    }
}

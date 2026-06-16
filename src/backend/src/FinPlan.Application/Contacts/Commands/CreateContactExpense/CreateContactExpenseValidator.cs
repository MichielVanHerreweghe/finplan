using FinPlan.Domain.Splitting;
using FluentValidation;

namespace FinPlan.Application.Contacts.Commands.CreateContactExpense;

// Guards the request shape; ContactExpense.Create remains the authoritative check on how the split
// resolves (amounts add up, percentages total 100, payer/participants are the two people, etc).
public sealed class CreateContactExpenseValidator : AbstractValidator<CreateContactExpenseCommand>
{
    public CreateContactExpenseValidator()
    {
        RuleFor(command => command.ContactId).GreaterThan(0);
        RuleFor(command => command.Description).NotEmpty();
        RuleFor(command => command.Amount).GreaterThan(0);
        RuleFor(command => command.PaidByUserId).GreaterThan(0);
        RuleFor(command => command.SplitType).NotEqual(SplitType.Undefined);
        RuleFor(command => command.Splits).NotEmpty();
    }
}

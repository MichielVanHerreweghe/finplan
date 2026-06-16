using FluentValidation;

namespace FinPlan.Application.Contacts.Commands.RecordContactSettlement;

public sealed class RecordContactSettlementValidator : AbstractValidator<RecordContactSettlementCommand>
{
    public RecordContactSettlementValidator()
    {
        RuleFor(command => command.ContactId).GreaterThan(0);
        RuleFor(command => command.Amount).GreaterThan(0);
        RuleFor(command => command.FromUserId).GreaterThan(0);
        RuleFor(command => command.ToUserId).GreaterThan(0);
    }
}

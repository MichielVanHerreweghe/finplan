using FluentValidation;

namespace FinPlan.Application.Transactions.Commands.UpdateTransactionCategory;

public sealed class UpdateTransactionCategoryValidator : AbstractValidator<UpdateTransactionCategoryCommand>
{
    public UpdateTransactionCategoryValidator()
    {
        RuleFor(command => command.Id).GreaterThan(0);
        RuleFor(command => command.Name).NotEmpty();
    }
}

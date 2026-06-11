using FluentValidation;

namespace FinPlan.Application.Transactions.Commands.DeleteTransactionCategory;

public sealed class DeleteTransactionCategoryValidator : AbstractValidator<DeleteTransactionCategoryCommand>
{
    public DeleteTransactionCategoryValidator() =>
        RuleFor(command => command.Id).GreaterThan(0);
}

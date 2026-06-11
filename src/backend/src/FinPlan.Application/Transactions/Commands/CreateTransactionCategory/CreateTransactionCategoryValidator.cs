using FluentValidation;

namespace FinPlan.Application.Transactions.Commands.CreateTransactionCategory;

public sealed class CreateTransactionCategoryValidator : AbstractValidator<CreateTransactionCategoryCommand>
{
    public CreateTransactionCategoryValidator() =>
        RuleFor(command => command.Name).NotEmpty();
}

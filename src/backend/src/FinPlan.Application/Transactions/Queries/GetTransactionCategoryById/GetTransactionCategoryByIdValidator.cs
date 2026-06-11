using FluentValidation;

namespace FinPlan.Application.Transactions.Queries.GetTransactionCategoryById;

public sealed class GetTransactionCategoryByIdValidator : AbstractValidator<GetTransactionCategoryByIdQuery>
{
    public GetTransactionCategoryByIdValidator() =>
        RuleFor(query => query.Id).GreaterThan(0);
}

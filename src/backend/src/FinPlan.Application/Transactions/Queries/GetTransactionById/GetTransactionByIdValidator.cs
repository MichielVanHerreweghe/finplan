using FluentValidation;

namespace FinPlan.Application.Transactions.Queries.GetTransactionById;

public sealed class GetTransactionByIdValidator : AbstractValidator<GetTransactionByIdQuery>
{
    public GetTransactionByIdValidator() =>
        RuleFor(query => query.Id).GreaterThan(0);
}

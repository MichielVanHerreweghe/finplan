using FluentValidation;

namespace FinPlan.Application.RecurringTransactions.Queries.GetRecurringTransactionById;

public sealed class GetRecurringTransactionByIdValidator : AbstractValidator<GetRecurringTransactionByIdQuery>
{
    public GetRecurringTransactionByIdValidator() =>
        RuleFor(query => query.Id).GreaterThan(0);
}

using FinPlan.Domain.Contacts;
using FinPlan.Domain.Splitting;

namespace FinPlan.Application.Contacts.Contracts;

public sealed record ContactExpenseResponse(
    int Id,
    string Description,
    DateOnly Date,
    decimal Amount,
    int PaidByUserId,
    SplitType SplitType,
    IReadOnlyList<ContactExpenseSplitResponse> Splits);

public sealed record ContactExpenseSplitResponse(int UserId, decimal Amount, decimal? Percentage);

internal static class ContactExpenseMapping
{
    public static ContactExpenseResponse ToResponse(this ContactExpense expense) =>
        new(expense.Id,
            expense.Description,
            expense.Date,
            expense.Amount,
            expense.PaidByUserId,
            expense.SplitType,
            expense.Splits
                .Select(split => new ContactExpenseSplitResponse(split.UserId, split.Amount, split.Percentage))
                .ToList());
}

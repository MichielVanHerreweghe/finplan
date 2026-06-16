using FinPlan.Domain.Common;

namespace FinPlan.Domain.Contacts;

// One participant's resolved share of a contact expense. A child of the ContactExpense aggregate.
// Amount is the concrete owed money; Percentage is retained only for percentage splits so the
// original intent can be shown back to the user.
public sealed class ContactExpenseSplit : Entity
{
    public int ContactExpenseId { get; private set; }
    public int UserId { get; private set; }
    public decimal Amount { get; private set; }
    public decimal? Percentage { get; private set; }

    internal ContactExpenseSplit(int userId, decimal amount, decimal? percentage)
    {
        UserId = userId;
        Amount = amount;
        Percentage = percentage;
    }
}

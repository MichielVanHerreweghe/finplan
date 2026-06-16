using FinPlan.Domain.Common;

namespace FinPlan.Domain.Activities;

// One participant's resolved share of a activity expense. A child of the ActivityExpense aggregate.
// Amount is always the concrete owed money; Percentage is retained only for Percentage splits
// so the original intent can be shown back to the user.
public sealed class ActivityExpenseSplit : Entity
{
    public int ActivityExpenseId { get; private set; }
    public int UserId { get; private set; }
    public decimal Amount { get; private set; }
    public decimal? Percentage { get; private set; }

    internal ActivityExpenseSplit(int userId, decimal amount, decimal? percentage)
    {
        UserId = userId;
        Amount = amount;
        Percentage = percentage;
    }
}

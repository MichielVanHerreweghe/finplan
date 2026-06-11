using FinPlan.Domain.Common;

namespace FinPlan.Domain.SavingGoals;

// Child of the SavingGoal aggregate: a single deposit towards a goal.
// Not an aggregate root — only created/removed through its parent SavingGoal.
public sealed class SavingGoalContribution : Entity
{
    public int SavingGoalId { get; private set; }
    public decimal Amount { get; private set; }
    public DateOnly Date { get; private set; }

    private SavingGoalContribution(decimal amount, DateOnly date)
    {
        Amount = amount;
        Date = date;
    }

    internal static SavingGoalContribution Create(decimal amount, DateOnly date) =>
        new(amount, date);
}

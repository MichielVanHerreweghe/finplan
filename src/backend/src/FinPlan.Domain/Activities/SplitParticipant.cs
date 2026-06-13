namespace FinPlan.Domain.Activities;

// One participant's intent for a split, as supplied to ActivityExpense.Create. Which fields
// matter depends on the SplitType: Equal ignores both, Exact uses ExactAmount, Percentage
// uses Percentage. The domain resolves these into concrete owed amounts (ActivityExpenseSplit).
public sealed record SplitParticipant(int UserId, decimal? ExactAmount, decimal? Percentage);

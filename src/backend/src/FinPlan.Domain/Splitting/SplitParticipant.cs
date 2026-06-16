namespace FinPlan.Domain.Splitting;

// One participant's intent for a split. Which fields matter depends on the SplitType: Equal
// ignores both, Exact uses ExactAmount, Percentage uses Percentage. ExpenseSplitCalculator
// resolves these into concrete owed amounts (ResolvedSplit).
public sealed record SplitParticipant(int UserId, decimal? ExactAmount, decimal? Percentage);

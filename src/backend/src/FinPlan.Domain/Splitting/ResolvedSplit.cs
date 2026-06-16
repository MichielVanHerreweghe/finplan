namespace FinPlan.Domain.Splitting;

// A participant's resolved share: the concrete owed Amount, plus the original Percentage (kept
// only for percentage splits so the intent can be shown back to the user).
public sealed record ResolvedSplit(int UserId, decimal Amount, decimal? Percentage);

namespace FinPlan.Domain.Splitting;

// How an expense's total is divided among its participants. Shared across features that split
// money (activities, contact ledgers).
public enum SplitType
{
    Undefined = 0,

    // Divide the total evenly across the participants (leftover cents go to the first few).
    Equal = 1,

    // Each participant owes a specific amount; the amounts must add up to the total.
    Exact = 2,

    // Each participant owes a percentage of the total; the percentages must add up to 100.
    Percentage = 3
}

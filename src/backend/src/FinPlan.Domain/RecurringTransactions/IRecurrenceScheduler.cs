namespace FinPlan.Domain.RecurringTransactions;

// Expands an iCal RRULE (RFC 5545) into concrete occurrence dates. Implemented in the
// infrastructure layer so the domain stays free of the scheduling library, while the
// recurrence policy (which occurrences become transactions) stays coordinated here and in
// the application layer. UNTIL/COUNT end conditions are honoured by the implementation
// because occurrences are always enumerated from the rule's start date.
public interface IRecurrenceScheduler
{
    // Occurrences in the inclusive range [fromInclusive, toInclusive], in ascending order.
    IReadOnlyList<DateOnly> Between(DateOnly start, string recurrenceRule, DateOnly fromInclusive, DateOnly toInclusive);

    // The first occurrence strictly after afterExclusive, or null when the series is exhausted.
    DateOnly? Next(DateOnly start, string recurrenceRule, DateOnly afterExclusive);

    // Whether the rule string parses as a valid RRULE; used by the create/update validators.
    bool IsValid(string recurrenceRule);
}

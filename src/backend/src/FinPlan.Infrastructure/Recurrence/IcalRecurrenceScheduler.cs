using FinPlan.Domain.RecurringTransactions;
using Ical.Net;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;

namespace FinPlan.Infrastructure.Recurrence;

// IRecurrenceScheduler backed by Ical.Net. Each call builds a one-off date-only event with the
// rule and asks Ical.Net for occurrences in a window. Ical.Net always enumerates from DTSTART,
// so UNTIL/COUNT end conditions are honoured regardless of the query window.
public sealed class IcalRecurrenceScheduler : IRecurrenceScheduler
{
    // A bounded horizon for "next occurrence" lookups on otherwise-unbounded rules.
    private const int UnboundedHorizonYears = 10;

    public IReadOnlyList<DateOnly> Between(
        DateOnly start, string recurrenceRule, DateOnly fromInclusive, DateOnly toInclusive)
    {
        if (fromInclusive > toInclusive)
            return [];

        return Occurrences(start, recurrenceRule, fromInclusive, toInclusive)
            .Where(date => date >= fromInclusive && date <= toInclusive)
            .Distinct()
            .OrderBy(date => date)
            .ToList();
    }

    public DateOnly? Next(DateOnly start, string recurrenceRule, DateOnly afterExclusive)
    {
        DateOnly from = afterExclusive.AddDays(1);
        DateOnly horizon = afterExclusive.AddYears(UnboundedHorizonYears);

        foreach (DateOnly date in Occurrences(start, recurrenceRule, from, horizon)
                     .Where(date => date > afterExclusive)
                     .OrderBy(date => date))
        {
            return date;
        }

        return null;
    }

    public bool IsValid(string recurrenceRule)
    {
        if (string.IsNullOrWhiteSpace(recurrenceRule))
            return false;

        try
        {
            RecurrencePattern pattern = new(recurrenceRule);
            return pattern.Frequency != FrequencyType.None;
        }
        catch
        {
            return false;
        }
    }

    private static IEnumerable<DateOnly> Occurrences(
        DateOnly start, string recurrenceRule, DateOnly fromInclusive, DateOnly toInclusive)
    {
        CalendarEvent calendarEvent = new()
        {
            // Date-only DTSTART; the rule drives the cadence.
            Start = new CalDateTime(start.Year, start.Month, start.Day),
            RecurrenceRules = [new RecurrencePattern(recurrenceRule)],
        };

        Calendar calendar = new();
        calendar.Events.Add(calendarEvent);

        // Ical.Net treats the query window as exclusive at both ends, so pad each side by a day;
        // callers re-filter to the precise inclusive [from, to] range.
        DateOnly paddedStart = fromInclusive.AddDays(-1);
        DateOnly paddedEnd = toInclusive.AddDays(1);

        return calendar
            .GetOccurrences(
                new CalDateTime(paddedStart.Year, paddedStart.Month, paddedStart.Day),
                new CalDateTime(paddedEnd.Year, paddedEnd.Month, paddedEnd.Day))
            .Select(occurrence => DateOnly.FromDateTime(occurrence.Period.StartTime.Value));
    }
}

using FinPlan.Domain.RecurringTransactions;
using FinPlan.Infrastructure.Recurrence;
using Xunit;

namespace FinPlan.Domain.Tests.RecurringTransactions;

public class IcalRecurrenceSchedulerTests
{
    private static readonly DateOnly Start = new(2026, 1, 1);
    private readonly IRecurrenceScheduler _scheduler = new IcalRecurrenceScheduler();

    [Fact]
    public void Between_Daily_ReturnsEveryDayInWindow()
    {
        IReadOnlyList<DateOnly> dates = _scheduler.Between(
            Start, "FREQ=DAILY", Start, Start.AddDays(4));

        Assert.Equal(
            [Start, Start.AddDays(1), Start.AddDays(2), Start.AddDays(3), Start.AddDays(4)],
            dates);
    }

    [Fact]
    public void Between_WeeklyInterval_RespectsInterval()
    {
        // Every 2 weeks from Jan 1; only Jan 1 and Jan 15 fall in January.
        IReadOnlyList<DateOnly> dates = _scheduler.Between(
            Start, "FREQ=WEEKLY;INTERVAL=2", Start, new DateOnly(2026, 1, 31));

        Assert.Equal([new DateOnly(2026, 1, 1), new DateOnly(2026, 1, 15), new DateOnly(2026, 1, 29)], dates);
    }

    [Fact]
    public void Between_CatchUp_ReturnsAllMissedOccurrences()
    {
        // Cursor sat at Jan 1; the job runs three months late.
        IReadOnlyList<DateOnly> dates = _scheduler.Between(
            Start, "FREQ=MONTHLY", Start, new DateOnly(2026, 3, 1));

        Assert.Equal(
            [new DateOnly(2026, 1, 1), new DateOnly(2026, 2, 1), new DateOnly(2026, 3, 1)],
            dates);
    }

    [Fact]
    public void Between_Count_HonoursTotalFromStart()
    {
        // COUNT=2 means only Jan 1 and Feb 1 ever exist, regardless of the query window.
        IReadOnlyList<DateOnly> dates = _scheduler.Between(
            Start, "FREQ=MONTHLY;COUNT=2", Start, new DateOnly(2026, 12, 31));

        Assert.Equal([new DateOnly(2026, 1, 1), new DateOnly(2026, 2, 1)], dates);
    }

    [Fact]
    public void Between_Until_StopsAtUntilDate()
    {
        IReadOnlyList<DateOnly> dates = _scheduler.Between(
            Start, "FREQ=MONTHLY;UNTIL=20260301", Start, new DateOnly(2026, 12, 31));

        Assert.Equal(
            [new DateOnly(2026, 1, 1), new DateOnly(2026, 2, 1), new DateOnly(2026, 3, 1)],
            dates);
    }

    [Fact]
    public void Next_ReturnsFirstOccurrenceStrictlyAfter()
    {
        DateOnly? next = _scheduler.Next(Start, "FREQ=MONTHLY", new DateOnly(2026, 1, 1));

        Assert.Equal(new DateOnly(2026, 2, 1), next);
    }

    [Fact]
    public void Next_AfterSeriesExhausted_ReturnsNull()
    {
        DateOnly? next = _scheduler.Next(Start, "FREQ=MONTHLY;COUNT=2", new DateOnly(2026, 2, 1));

        Assert.Null(next);
    }

    [Fact]
    public void MonthlyFromMonthEnd_SkipsMonthsWithoutThatDay()
    {
        DateOnly jan31 = new(2026, 1, 31);

        IReadOnlyList<DateOnly> dates = _scheduler.Between(
            jan31, "FREQ=MONTHLY", jan31, new DateOnly(2026, 3, 31));

        // Per RFC 5545, a monthly rule on day 31 skips months that lack a 31st (February)
        // rather than clamping — so February is omitted and March 31 is the next occurrence.
        Assert.Equal([new DateOnly(2026, 1, 31), new DateOnly(2026, 3, 31)], dates);
    }

    [Fact]
    public void IsValid_RejectsGarbageAndAcceptsRrule()
    {
        Assert.True(_scheduler.IsValid("FREQ=DAILY"));
        Assert.False(_scheduler.IsValid("not-a-rule"));
        Assert.False(_scheduler.IsValid(""));
    }
}

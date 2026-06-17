using FinPlan.Domain.RecurringTransactions;
using FinPlan.Domain.Transactions;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.RecurringTransactions;

public class RecurringTransactionTests
{
    private static readonly DateOnly Start = new(2026, 1, 1);
    private const string MonthlyRule = "FREQ=MONTHLY;INTERVAL=1";

    private static Result<RecurringTransaction> CreateExpense(
        string rule = MonthlyRule, DateOnly? firstOccurrence = null) =>
        RecurringTransaction.Create(
            "Rent", 1200m, TransactionType.Expense, categoryId: null,
            fromPocketId: 1, toPocketId: null, savingGoalId: null,
            rule, Start, firstOccurrence ?? Start);

    [Fact]
    public void Create_Valid_CarriesScheduleAndCursor()
    {
        Result<RecurringTransaction> result = CreateExpense();

        Assert.True(result.IsSuccess);
        Assert.Equal(MonthlyRule, result.Value.RecurrenceRule);
        Assert.Equal(Start, result.Value.StartDate);
        Assert.Equal(Start, result.Value.NextOccurrence);
        Assert.False(result.Value.IsPaused);
    }

    [Fact]
    public void Create_EmptyRule_Fails()
    {
        Result<RecurringTransaction> result = CreateExpense(rule: "  ");

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_EnforcesTransactionEndpointRules()
    {
        // Expense cannot have a destination pocket — same rule as Transaction.
        Result<RecurringTransaction> result = RecurringTransaction.Create(
            "Rent", 1200m, TransactionType.Expense, categoryId: null,
            fromPocketId: 1, toPocketId: 2, savingGoalId: null,
            MonthlyRule, Start, Start);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void CreateOccurrence_ProducesTransactionDatedToOccurrence()
    {
        RecurringTransaction recurring = CreateExpense().Value;
        DateOnly occurrenceDate = new(2026, 3, 1);

        Result<Transaction> occurrence = recurring.CreateOccurrence(occurrenceDate);

        Assert.True(occurrence.IsSuccess);
        Assert.Equal(occurrenceDate, occurrence.Value.Date);
        Assert.Equal("Rent", occurrence.Value.Name);
        Assert.Equal(1200m, occurrence.Value.Amount);
        Assert.Equal(TransactionType.Expense, occurrence.Value.Type);
        Assert.Equal(1, occurrence.Value.FromPocketId);
    }

    [Fact]
    public void MarkGenerated_AdvancesCursorAndRecordsLastDate()
    {
        RecurringTransaction recurring = CreateExpense().Value;
        DateOnly generated = new(2026, 1, 1);
        DateOnly next = new(2026, 2, 1);

        recurring.MarkGenerated(generated, next);

        Assert.Equal(generated, recurring.LastGeneratedDate);
        Assert.Equal(next, recurring.NextOccurrence);
    }

    [Fact]
    public void MarkGenerated_NullNext_MarksSeriesExhausted()
    {
        RecurringTransaction recurring = CreateExpense().Value;

        recurring.MarkGenerated(new DateOnly(2026, 12, 1), nextOccurrence: null);

        Assert.Null(recurring.NextOccurrence);
    }

    [Fact]
    public void Pause_HaltsGenerationAndRecordsReason()
    {
        RecurringTransaction recurring = CreateExpense().Value;

        recurring.Pause("Pocket 1 does not exist.");

        Assert.True(recurring.IsPaused);
        Assert.Equal("Pocket 1 does not exist.", recurring.PauseReason);
        Assert.Null(recurring.NextOccurrence);
    }

    [Fact]
    public void Update_RevivesPausedDefinition()
    {
        RecurringTransaction recurring = CreateExpense().Value;
        recurring.Pause("broken");

        Result updated = recurring.Update(
            "Rent", 1300m, TransactionType.Expense, categoryId: null,
            fromPocketId: 1, toPocketId: null, savingGoalId: null,
            MonthlyRule, Start, nextOccurrence: new DateOnly(2026, 2, 1));

        Assert.True(updated.IsSuccess);
        Assert.False(recurring.IsPaused);
        Assert.Null(recurring.PauseReason);
        Assert.Equal(new DateOnly(2026, 2, 1), recurring.NextOccurrence);
        Assert.Equal(1300m, recurring.Amount);
    }
}

using FinPlan.Domain.Common;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Domain.RecurringTransactions;

// A template plus a recurrence rule from which the daily job materialises real Transactions.
// The template fields mirror Transaction exactly; Transaction.Create stays the authoritative
// invariant check, reused by CreateOccurrence so the rules live in one place.
public sealed class RecurringTransaction : OwnedEntity, IAggregateRoot
{
    public string Name { get; private set; }
    public decimal Amount { get; private set; }
    public TransactionType Type { get; private set; }
    public int? CategoryId { get; private set; }

    // Same endpoint semantics as Transaction: Income -> ToPocketId, Expense -> FromPocketId,
    // Transfer -> both. Governed by Type.
    public int? FromPocketId { get; private set; }
    public int? ToPocketId { get; private set; }
    public int? SavingGoalId { get; private set; }

    // iCal RRULE (RFC 5545), e.g. "FREQ=MONTHLY;INTERVAL=1;COUNT=12". The DTSTART is StartDate.
    public string RecurrenceRule { get; private set; }
    public DateOnly StartDate { get; private set; }

    // Denormalised cursor: the earliest occurrence not yet materialised. The daily job filters
    // on this (indexed) column so discovery never has to evaluate the rule. Null once the series
    // is exhausted or the definition has been paused.
    public DateOnly? NextOccurrence { get; private set; }

    // The most recent occurrence date actually materialised into a Transaction (audit/visibility).
    public DateOnly? LastGeneratedDate { get; private set; }

    // Set when generation is blocked (e.g. a referenced pocket/category/goal no longer exists),
    // which also clears NextOccurrence so the job stops picking it up until the user fixes it.
    public DateTime? PausedAt { get; private set; }
    public string? PauseReason { get; private set; }

    public bool IsPaused => PausedAt is not null;

    private RecurringTransaction(
        string name,
        decimal amount,
        TransactionType type,
        int? categoryId,
        int? fromPocketId,
        int? toPocketId,
        int? savingGoalId,
        string recurrenceRule,
        DateOnly startDate,
        DateOnly? firstOccurrence)
    {
        Name = name;
        Amount = amount;
        Type = type;
        CategoryId = categoryId;
        FromPocketId = fromPocketId;
        ToPocketId = toPocketId;
        SavingGoalId = savingGoalId;
        RecurrenceRule = recurrenceRule;
        StartDate = startDate;
        NextOccurrence = firstOccurrence;
    }

    // firstOccurrence is computed by the caller via IRecurrenceScheduler (the date authority);
    // the domain validates the template and stores the cursor. A null firstOccurrence means the
    // rule yields no occurrences (e.g. an UNTIL already in the past) — created already-exhausted.
    public static Result<RecurringTransaction> Create(
        string name,
        decimal amount,
        TransactionType type,
        int? categoryId,
        int? fromPocketId,
        int? toPocketId,
        int? savingGoalId,
        string recurrenceRule,
        DateOnly startDate,
        DateOnly? firstOccurrence)
    {
        Result validationResult = Validate(
            name, amount, type, categoryId, fromPocketId, toPocketId, savingGoalId, recurrenceRule);

        if (validationResult.IsFailed)
            return validationResult;

        return new RecurringTransaction(
            name, amount, type, categoryId, fromPocketId, toPocketId, savingGoalId,
            recurrenceRule, startDate, firstOccurrence);
    }

    public Result Update(
        string name,
        decimal amount,
        TransactionType type,
        int? categoryId,
        int? fromPocketId,
        int? toPocketId,
        int? savingGoalId,
        string recurrenceRule,
        DateOnly startDate,
        DateOnly? nextOccurrence)
    {
        Result validationResult = Validate(
            name, amount, type, categoryId, fromPocketId, toPocketId, savingGoalId, recurrenceRule);

        if (validationResult.IsFailed)
            return validationResult;

        Name = name;
        Amount = amount;
        Type = type;
        CategoryId = categoryId;
        FromPocketId = fromPocketId;
        ToPocketId = toPocketId;
        SavingGoalId = savingGoalId;
        RecurrenceRule = recurrenceRule;
        StartDate = startDate;
        NextOccurrence = nextOccurrence;

        // Editing a paused definition revives it; the recomputed cursor decides the rest.
        PausedAt = null;
        PauseReason = null;

        return Result.Ok();
    }

    // Builds the Transaction for one occurrence date, reusing Transaction.Create so the
    // endpoint/type/amount invariants are enforced identically to a hand-entered transaction.
    public Result<Transaction> CreateOccurrence(DateOnly date) =>
        Transaction.Create(
            Name, date, Amount, Type, CategoryId, FromPocketId, ToPocketId, SavingGoalId);

    // Advances the cursor after materialising occurrences. nextOccurrence is null when the
    // series is exhausted.
    public void MarkGenerated(DateOnly lastGeneratedDate, DateOnly? nextOccurrence)
    {
        LastGeneratedDate = lastGeneratedDate;
        NextOccurrence = nextOccurrence;
    }

    // Halts generation and records why; the user fixes the cause and edits to resume.
    public void Pause(string reason)
    {
        PausedAt = DateTime.UtcNow;
        PauseReason = reason;
        NextOccurrence = null;
    }

    private static Result Validate(
        string name,
        decimal amount,
        TransactionType type,
        int? categoryId,
        int? fromPocketId,
        int? toPocketId,
        int? savingGoalId,
        string recurrenceRule)
    {
        Result result = new();

        if (string.IsNullOrWhiteSpace(name))
            result.WithError("Name cannot be empty.");

        if (amount <= 0)
            result.WithError("Amount must be greater than zero.");

        if (type == TransactionType.Undefined)
            result.WithError("TransactionType cannot be undefined.");

        if (string.IsNullOrWhiteSpace(recurrenceRule))
            result.WithError("Recurrence rule cannot be empty.");

        if (categoryId is <= 0)
            result.WithError("Invalid category id.");

        if (fromPocketId is <= 0)
            result.WithError("Invalid source pocket id.");

        if (toPocketId is <= 0)
            result.WithError("Invalid destination pocket id.");

        if (savingGoalId is <= 0)
            result.WithError("Invalid saving goal id.");

        ValidateEndpoints(type, fromPocketId, toPocketId, result);

        return result;
    }

    // Mirrors Transaction.ValidateEndpoints: each type fixes which pocket endpoints are present.
    private static void ValidateEndpoints(TransactionType type, int? fromPocketId, int? toPocketId, Result result)
    {
        switch (type)
        {
            case TransactionType.Income:
                if (toPocketId is null)
                    result.WithError("Income requires a destination pocket.");
                if (fromPocketId is not null)
                    result.WithError("Income cannot have a source pocket.");
                break;

            case TransactionType.Expense:
                if (fromPocketId is null)
                    result.WithError("Expense requires a source pocket.");
                if (toPocketId is not null)
                    result.WithError("Expense cannot have a destination pocket.");
                break;

            case TransactionType.Transfer:
                if (fromPocketId is null || toPocketId is null)
                    result.WithError("Transfer requires both a source and a destination pocket.");
                else if (fromPocketId == toPocketId)
                    result.WithError("Transfer source and destination pockets must differ.");
                break;
        }
    }
}

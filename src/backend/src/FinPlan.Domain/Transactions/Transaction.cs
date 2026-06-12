using FinPlan.Domain.Common;
using FluentResults;

namespace FinPlan.Domain.Transactions;

public sealed class Transaction : Entity, IAggregateRoot
{
    public string Name { get; private set; }
    public DateOnly Date { get; private set; }
    public decimal Amount { get; private set; }
    public TransactionType Type { get; private set; }
    public int? CategoryId { get; private set; }

    // Endpoints of the money movement. Which are set is governed by Type:
    //   Income   -> ToPocketId only (money enters from outside)
    //   Expense  -> FromPocketId only (money leaves to outside)
    //   Transfer -> both (money moves between two pockets)
    public int? FromPocketId { get; private set; }
    public int? ToPocketId { get; private set; }

    // Optional tag marking this transaction as a contribution toward a specific saving goal.
    // A goal's progress is the sum of its tagged transactions, so goals sharing a pocket stay independent.
    public int? SavingGoalId { get; private set; }

    private Transaction(string name,
        DateOnly date,
        decimal amount,
        TransactionType type,
        int? categoryId,
        int? fromPocketId,
        int? toPocketId,
        int? savingGoalId)
    {
        Name = name;
        Date = date;
        Amount = amount;
        Type = type;
        CategoryId = categoryId;
        FromPocketId = fromPocketId;
        ToPocketId = toPocketId;
        SavingGoalId = savingGoalId;
    }

    public static Result<Transaction> Create(string name, DateOnly date, decimal amount, TransactionType type, int? categoryId, int? fromPocketId, int? toPocketId, int? savingGoalId)
    {
        Result validationResult = Validate(name, date, amount, type, categoryId, fromPocketId, toPocketId, savingGoalId);

        if (validationResult.IsFailed)
            return validationResult;

        return new Transaction(name, date, amount, type, categoryId, fromPocketId, toPocketId, savingGoalId);
    }

    public Result Update(string name, DateOnly date, decimal amount, TransactionType type, int? categoryId, int? fromPocketId, int? toPocketId, int? savingGoalId)
    {
        Result validationResult = Validate(name, date, amount, type, categoryId, fromPocketId, toPocketId, savingGoalId);

        if (validationResult.IsFailed)
            return validationResult;

        Name = name;
        Date = date;
        Amount = amount;
        Type = type;
        CategoryId = categoryId;
        FromPocketId = fromPocketId;
        ToPocketId = toPocketId;
        SavingGoalId = savingGoalId;

        return Result.Ok();
    }

    private static Result Validate(string name, DateOnly date, decimal amount, TransactionType type, int? categoryId, int? fromPocketId, int? toPocketId, int? savingGoalId)
    {
        Result result = new();

        if (string.IsNullOrWhiteSpace(name))
            result.WithError("Name cannot be empty.");

        if (amount <= 0)
            result.WithError("Amount must be greater than zero.");

        if (type == TransactionType.Undefined)
            result.WithError("TransactionType cannot be undefined.");

        // null means "uncategorized" and is allowed; a supplied id must be positive.
        if (categoryId is <= 0)
            result.WithError("Invalid category id.");

        if (fromPocketId is <= 0)
            result.WithError("Invalid source pocket id.");

        if (toPocketId is <= 0)
            result.WithError("Invalid destination pocket id.");

        // null means "not tied to a goal"; a supplied id must be positive.
        if (savingGoalId is <= 0)
            result.WithError("Invalid saving goal id.");

        ValidateEndpoints(type, fromPocketId, toPocketId, result);

        return result;
    }

    // Each type fixes which endpoints must be present; direction lives here, not in the amount sign.
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
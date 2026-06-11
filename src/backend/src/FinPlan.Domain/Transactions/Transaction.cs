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

    private Transaction(string name,
        DateOnly date,
        decimal amount,
        TransactionType type,
        int? categoryId)
    {
        Name = name;
        Date = date;
        Amount = amount;
        Type = type;
        CategoryId = categoryId;
    }
    
    public static Result<Transaction> Create(string name, DateOnly date, decimal amount, TransactionType type, int? categoryId)
    {
        Result validationResult = Validate(name, date, amount, type, categoryId);

        if (validationResult.IsFailed)
            return validationResult;

        return new Transaction(name, date, amount, type, categoryId);
    }

    public Result Update(string name, DateOnly date, decimal amount, TransactionType type, int? categoryId)
    {
        Result validationResult = Validate(name, date, amount, type, categoryId);

        if (validationResult.IsFailed)
            return validationResult;

        Name = name;
        Date = date;
        Amount = amount;
        Type = type;
        CategoryId = categoryId;

        return Result.Ok();
    }

    private static Result Validate(string name, DateOnly date, decimal amount, TransactionType type, int? categoryId)
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

        return result;
    }
}
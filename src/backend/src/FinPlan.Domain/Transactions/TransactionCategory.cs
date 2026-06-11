using FinPlan.Domain.Common;
using FluentResults;

namespace FinPlan.Domain.Transactions;

public sealed class TransactionCategory : Entity, IAggregateRoot
{
    public string Name { get; private set; }

    private TransactionCategory(string name)
    {
        Name = name;
    }

    public static Result<TransactionCategory> Create(string name)
    {
        Result validationResult = Validate(name);

        if (validationResult.IsFailed)
            return validationResult;

        return new TransactionCategory(name);
    }

    public Result Update(string name)
    {
        Result validationResult = Validate(name);

        if (validationResult.IsFailed)
            return validationResult;

        Name = name;

        return Result.Ok();
    }

    private static Result Validate(string name)
    {
        Result result = new();

        if (string.IsNullOrWhiteSpace(name))
            result.WithError("Name cannot be empty.");

        return result;
    }
}
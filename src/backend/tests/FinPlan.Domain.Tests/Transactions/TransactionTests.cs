using FinPlan.Domain.Transactions;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.Transactions;

public class TransactionTests
{
    private static readonly DateOnly Today = new(2026, 1, 1);

    [Fact]
    public void Income_RequiresDestinationOnly()
    {
        Result<Transaction> ok = Transaction.Create(
            "Salary", Today, 1000m, TransactionType.Income, null, fromPocketId: null, toPocketId: 1, savingGoalId: null);
        Assert.True(ok.IsSuccess);

        Result<Transaction> missingTo = Transaction.Create(
            "Salary", Today, 1000m, TransactionType.Income, null, fromPocketId: null, toPocketId: null, savingGoalId: null);
        Assert.True(missingTo.IsFailed);

        Result<Transaction> hasFrom = Transaction.Create(
            "Salary", Today, 1000m, TransactionType.Income, null, fromPocketId: 2, toPocketId: 1, savingGoalId: null);
        Assert.True(hasFrom.IsFailed);
    }

    [Fact]
    public void Expense_RequiresSourceOnly()
    {
        Result<Transaction> ok = Transaction.Create(
            "Groceries", Today, 50m, TransactionType.Expense, null, fromPocketId: 1, toPocketId: null, savingGoalId: null);
        Assert.True(ok.IsSuccess);

        Result<Transaction> missingFrom = Transaction.Create(
            "Groceries", Today, 50m, TransactionType.Expense, null, fromPocketId: null, toPocketId: null, savingGoalId: null);
        Assert.True(missingFrom.IsFailed);

        Result<Transaction> hasTo = Transaction.Create(
            "Groceries", Today, 50m, TransactionType.Expense, null, fromPocketId: 1, toPocketId: 2, savingGoalId: null);
        Assert.True(hasTo.IsFailed);
    }

    [Fact]
    public void Transfer_RequiresBothDistinctEndpoints()
    {
        Result<Transaction> ok = Transaction.Create(
            "Move", Today, 300m, TransactionType.Transfer, null, fromPocketId: 1, toPocketId: 2, savingGoalId: null);
        Assert.True(ok.IsSuccess);

        Result<Transaction> missingOne = Transaction.Create(
            "Move", Today, 300m, TransactionType.Transfer, null, fromPocketId: 1, toPocketId: null, savingGoalId: null);
        Assert.True(missingOne.IsFailed);

        Result<Transaction> sameEndpoints = Transaction.Create(
            "Move", Today, 300m, TransactionType.Transfer, null, fromPocketId: 1, toPocketId: 1, savingGoalId: null);
        Assert.True(sameEndpoints.IsFailed);
    }

    [Fact]
    public void Create_WithNonPositiveAmount_Fails()
    {
        Result<Transaction> result = Transaction.Create(
            "Bad", Today, 0m, TransactionType.Income, null, fromPocketId: null, toPocketId: 1, savingGoalId: null);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_TaggedToSavingGoal_CarriesTheTag()
    {
        Result<Transaction> result = Transaction.Create(
            "Fund", Today, 100m, TransactionType.Transfer, null, fromPocketId: 1, toPocketId: 2, savingGoalId: 7);

        Assert.True(result.IsSuccess);
        Assert.Equal(7, result.Value.SavingGoalId);
    }
}

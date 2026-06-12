using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Commands.CreateTransaction;

public sealed record CreateTransactionCommand(
    string Name,
    DateOnly Date,
    decimal Amount,
    TransactionType Type,
    int? CategoryId,
    int? FromPocketId,
    int? ToPocketId,
    int? SavingGoalId) : ICommand<Result<int>>;

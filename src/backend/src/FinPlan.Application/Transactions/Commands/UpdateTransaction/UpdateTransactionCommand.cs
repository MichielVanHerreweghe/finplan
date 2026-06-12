using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Commands.UpdateTransaction;

public sealed record UpdateTransactionCommand(
    int Id,
    string Name,
    DateOnly Date,
    decimal Amount,
    TransactionType Type,
    int? CategoryId,
    int? FromPocketId,
    int? ToPocketId,
    int? SavingGoalId) : ICommand;

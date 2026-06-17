using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.RecurringTransactions.Commands.CreateRecurringTransaction;

public sealed record CreateRecurringTransactionCommand(
    string Name,
    decimal Amount,
    TransactionType Type,
    int? CategoryId,
    int? FromPocketId,
    int? ToPocketId,
    int? SavingGoalId,
    string RecurrenceRule,
    DateOnly StartDate) : ICommand<Result<int>>;

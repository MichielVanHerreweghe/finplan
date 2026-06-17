using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Transactions;

namespace FinPlan.Application.RecurringTransactions.Commands.UpdateRecurringTransaction;

public sealed record UpdateRecurringTransactionCommand(
    int Id,
    string Name,
    decimal Amount,
    TransactionType Type,
    int? CategoryId,
    int? FromPocketId,
    int? ToPocketId,
    int? SavingGoalId,
    string RecurrenceRule,
    DateOnly StartDate) : ICommand;

using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.RecurringTransactions.Commands.DeleteRecurringTransaction;

public sealed record DeleteRecurringTransactionCommand(int Id) : ICommand;

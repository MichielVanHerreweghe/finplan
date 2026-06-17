using FinPlan.Application.Common.Messaging;
using FluentResults;

namespace FinPlan.Application.RecurringTransactions.Commands.GenerateDueRecurringTransactions;

// Materialises every occurrence due on or before Today for the current owner. Dispatched once
// per owner by the daily worker, inside that owner's scope. Returns the number of transactions
// created.
public sealed record GenerateDueRecurringTransactionsCommand(DateOnly Today) : ICommand<Result<int>>;

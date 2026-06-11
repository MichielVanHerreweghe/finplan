using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Transactions.Commands.DeleteTransaction;

public sealed record DeleteTransactionCommand(int Id) : ICommand;

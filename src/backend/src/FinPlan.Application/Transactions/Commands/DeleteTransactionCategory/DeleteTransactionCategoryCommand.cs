using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Transactions.Commands.DeleteTransactionCategory;

public sealed record DeleteTransactionCategoryCommand(int Id) : ICommand;

using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Transactions.Commands.UpdateTransactionCategory;

public sealed record UpdateTransactionCategoryCommand(int Id, string Name) : ICommand;

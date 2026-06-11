using FinPlan.Application.Common.Messaging;
using FluentResults;

namespace FinPlan.Application.Transactions.Commands.CreateTransactionCategory;

public sealed record CreateTransactionCategoryCommand(string Name) : ICommand<Result<int>>;

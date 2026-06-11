using FinPlan.Domain.Transactions;

namespace FinPlan.Api.GraphQL;

// API-owned input shapes so the GraphQL schema stays decoupled from the application commands.

public sealed record CreateTransactionInput(
    string Name,
    DateOnly Date,
    decimal Amount,
    TransactionType Type,
    int? CategoryId);

public sealed record UpdateTransactionInput(
    int Id,
    string Name,
    DateOnly Date,
    decimal Amount,
    TransactionType Type,
    int? CategoryId);

public sealed record CreateTransactionCategoryInput(string Name);

public sealed record UpdateTransactionCategoryInput(int Id, string Name);

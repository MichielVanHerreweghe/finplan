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

public sealed record CreateSavingGoalInput(
    string Name,
    string? Description,
    decimal TargetAmount,
    DateOnly? Deadline);

public sealed record UpdateSavingGoalInput(
    int Id,
    string Name,
    string? Description,
    decimal TargetAmount,
    DateOnly? Deadline);

public sealed record AddContributionInput(int SavingGoalId, decimal Amount, DateOnly Date);

public sealed record RemoveContributionInput(int SavingGoalId, int ContributionId);

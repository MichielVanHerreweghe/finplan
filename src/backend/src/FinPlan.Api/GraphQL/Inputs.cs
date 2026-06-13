using FinPlan.Domain.Transactions;

namespace FinPlan.Api.GraphQL;

// API-owned input shapes so the GraphQL schema stays decoupled from the application commands.

public sealed record CreateTransactionInput(
    string Name,
    DateOnly Date,
    decimal Amount,
    TransactionType Type,
    int? CategoryId,
    int? FromPocketId,
    int? ToPocketId,
    int? SavingGoalId);

public sealed record UpdateTransactionInput(
    int Id,
    string Name,
    DateOnly Date,
    decimal Amount,
    TransactionType Type,
    int? CategoryId,
    int? FromPocketId,
    int? ToPocketId,
    int? SavingGoalId);

public sealed record CreateTransactionCategoryInput(string Name);

public sealed record UpdateTransactionCategoryInput(int Id, string Name);

public sealed record CreateSavingGoalInput(
    string Name,
    string? Description,
    decimal TargetAmount,
    DateOnly? Deadline,
    int PocketId);

public sealed record UpdateSavingGoalInput(
    int Id,
    string Name,
    string? Description,
    decimal TargetAmount,
    DateOnly? Deadline,
    int PocketId);

public sealed record CreatePocketInput(
    string Name,
    string? Description,
    int? ParentPocketId,
    decimal StartingAmount);

public sealed record UpdatePocketInput(
    int Id,
    string Name,
    string? Description,
    int? ParentPocketId,
    decimal StartingAmount);

public sealed record CreateGroupInput(string Name, string? Description);

public sealed record AddGroupMemberInput(int GroupId, string Email);

public sealed record RemoveGroupMemberInput(int GroupId, int UserId);

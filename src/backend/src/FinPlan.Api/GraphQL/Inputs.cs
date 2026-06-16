using FinPlan.Domain.Invitations;
using FinPlan.Domain.Splitting;
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

public sealed record CreateActivityInput(string Name, string? Description);

public sealed record RemoveActivityMemberInput(int ActivityId, int UserId);

public sealed record CreateActivityExpenseInput(
    int ActivityId,
    string Description,
    DateOnly Date,
    decimal Amount,
    int PaidByUserId,
    SplitType SplitType,
    IReadOnlyList<SplitInput> Splits);

public sealed record SplitInput(int UserId, decimal? ExactAmount, decimal? Percentage);

public sealed record CreateGroupInput(string Name, string? Description);

public sealed record RemoveGroupMemberInput(int GroupId, int UserId);

public sealed record CompleteProfileInput(string FirstName, string LastName);

public sealed record RemoveContactInput(int ContactId);

public sealed record SendInvitationInput(InvitationType Type, string Email, int? TargetId);

public sealed record AcceptInvitationInput(int InvitationId);

public sealed record DeclineInvitationInput(int InvitationId);

public sealed record CreateContactExpenseInput(
    int ContactId,
    string Description,
    DateOnly Date,
    decimal Amount,
    int PaidByUserId,
    SplitType SplitType,
    IReadOnlyList<SplitInput> Splits);

public sealed record RecordContactSettlementInput(
    int ContactId,
    decimal Amount,
    DateOnly Date,
    int FromUserId,
    int ToUserId);

// ---- Query filter inputs (server-side search / filter / sort) ----

public sealed record TransactionFilterInput(
    string? Search = null,
    TransactionType? Type = null,
    int? CategoryId = null,
    bool Uncategorized = false,
    DateOnly? FromDate = null,
    DateOnly? ToDate = null);

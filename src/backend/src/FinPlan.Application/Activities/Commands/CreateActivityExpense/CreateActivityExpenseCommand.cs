using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Activities;
using FluentResults;

namespace FinPlan.Application.Activities.Commands.CreateActivityExpense;

public sealed record CreateActivityExpenseCommand(
    int ActivityId,
    string Description,
    DateOnly Date,
    decimal Amount,
    int PaidByUserId,
    SplitType SplitType,
    IReadOnlyList<ExpenseSplitInput> Splits) : ICommand<Result<int>>;

// One participant's split intent. ExactAmount is used for Exact splits, Percentage for
// Percentage splits; both are ignored for Equal. The domain resolves the owed amounts.
public sealed record ExpenseSplitInput(int UserId, decimal? ExactAmount, decimal? Percentage);

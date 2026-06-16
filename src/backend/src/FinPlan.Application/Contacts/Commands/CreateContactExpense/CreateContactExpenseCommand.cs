using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Splitting;
using FluentResults;

namespace FinPlan.Application.Contacts.Commands.CreateContactExpense;

// Returns the new expense's id. ContactId is the current user's contact row; the other party and
// canonical pair are resolved from it.
public sealed record CreateContactExpenseCommand(
    int ContactId,
    string Description,
    DateOnly Date,
    decimal Amount,
    int PaidByUserId,
    SplitType SplitType,
    IReadOnlyList<ContactSplitInput> Splits) : ICommand<Result<int>>;

// One participant's split intent. ExactAmount is used for Exact splits, Percentage for Percentage
// splits; both are ignored for Equal. The domain resolves the owed amounts.
public sealed record ContactSplitInput(int UserId, decimal? ExactAmount, decimal? Percentage);

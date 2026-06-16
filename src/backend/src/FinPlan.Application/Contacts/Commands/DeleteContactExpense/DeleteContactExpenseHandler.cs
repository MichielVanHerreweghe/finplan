using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Contacts;
using FluentResults;

namespace FinPlan.Application.Contacts.Commands.DeleteContactExpense;

internal sealed class DeleteContactExpenseHandler(
    IContactLedgerRepository ledger,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<DeleteContactExpenseCommand, Result>
{
    public async Task<Result> Handle(DeleteContactExpenseCommand command, CancellationToken ct)
    {
        ContactExpense? expense = await ledger.GetExpenseByIdAsync(command.ExpenseId, ct);

        // The ledger has no owner query filter, so authorization is enforced here: only the two
        // people in the pair may touch it.
        if (expense is null ||
            (expense.UserAId != currentUser.CurrentUserId && expense.UserBId != currentUser.CurrentUserId))
            return Result.Fail($"Expense {command.ExpenseId} does not exist.");

        ledger.RemoveExpense(expense);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

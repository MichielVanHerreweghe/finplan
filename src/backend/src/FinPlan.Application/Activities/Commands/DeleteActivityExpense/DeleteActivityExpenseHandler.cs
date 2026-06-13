using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Activities;
using FluentResults;

namespace FinPlan.Application.Activities.Commands.DeleteActivityExpense;

internal sealed class DeleteActivityExpenseHandler(
    IActivityRepository activities,
    IActivityExpenseRepository expenses,
    ICurrentOwnerProvider currentOwner,
    IUnitOfWork unitOfWork) : ICommandHandler<DeleteActivityExpenseCommand, Result>
{
    public async Task<Result> Handle(DeleteActivityExpenseCommand command, CancellationToken ct)
    {
        ActivityExpense? expense = await expenses.GetByIdAsync(command.Id, ct);

        if (expense is null)
            return Result.Fail($"Expense {command.Id} does not exist.");

        // Only members of the expense's activity may delete it.
        Activity? activity = await activities.GetByIdForUserAsync(expense.ActivityId, currentOwner.CurrentOwnerId, ct);

        if (activity is null)
            return Result.Fail($"Expense {command.Id} does not exist.");

        expenses.Remove(expense);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

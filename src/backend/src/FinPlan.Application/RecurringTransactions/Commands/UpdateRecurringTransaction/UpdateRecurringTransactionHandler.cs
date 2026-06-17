using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.RecurringTransactions;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.RecurringTransactions.Commands.UpdateRecurringTransaction;

internal sealed class UpdateRecurringTransactionHandler(
    IRecurringTransactionRepository recurringTransactions,
    ITransactionCategoryRepository categories,
    IPocketRepository pockets,
    ISavingGoalRepository savingGoals,
    IRecurrenceScheduler scheduler,
    IUnitOfWork unitOfWork) : ICommandHandler<UpdateRecurringTransactionCommand, Result>
{
    public async Task<Result> Handle(UpdateRecurringTransactionCommand command, CancellationToken ct)
    {
        RecurringTransaction? recurringTransaction = await recurringTransactions.GetByIdAsync(command.Id, ct);

        if (recurringTransaction is null)
            return Result.Fail($"Recurring transaction {command.Id} does not exist.");

        Result references = await RecurringTransactionReferences.EnsureExist(
            categories, savingGoals, pockets,
            command.CategoryId, command.SavingGoalId, command.FromPocketId, command.ToPocketId, ct);

        if (references.IsFailed)
            return references;

        // Recompute the cursor against the (possibly new) rule while preserving already-generated
        // history: the next occurrence is the first one after the last generated date, or the first
        // on or after StartDate when nothing has been generated yet. This avoids re-emitting past
        // occurrences when an existing definition is edited.
        DateOnly anchor = recurringTransaction.LastGeneratedDate ?? command.StartDate.AddDays(-1);
        DateOnly? nextOccurrence = scheduler.Next(command.StartDate, command.RecurrenceRule, anchor);

        Result updated = recurringTransaction.Update(
            command.Name, command.Amount, command.Type, command.CategoryId,
            command.FromPocketId, command.ToPocketId, command.SavingGoalId,
            command.RecurrenceRule, command.StartDate, nextOccurrence);

        if (updated.IsFailed)
            return updated;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

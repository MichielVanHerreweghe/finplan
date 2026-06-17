using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.RecurringTransactions;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.RecurringTransactions.Commands.CreateRecurringTransaction;

internal sealed class CreateRecurringTransactionHandler(
    IRecurringTransactionRepository recurringTransactions,
    ITransactionCategoryRepository categories,
    IPocketRepository pockets,
    ISavingGoalRepository savingGoals,
    IRecurrenceScheduler scheduler,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateRecurringTransactionCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreateRecurringTransactionCommand command, CancellationToken ct)
    {
        Result references = await RecurringTransactionReferences.EnsureExist(
            categories, savingGoals, pockets,
            command.CategoryId, command.SavingGoalId, command.FromPocketId, command.ToPocketId, ct);

        if (references.IsFailed)
            return references.ToResult<int>();

        // The scheduler owns the dates: the first occurrence is the earliest on or after StartDate.
        DateOnly? firstOccurrence = scheduler.Next(
            command.StartDate, command.RecurrenceRule, command.StartDate.AddDays(-1));

        Result<RecurringTransaction> created = RecurringTransaction.Create(
            command.Name, command.Amount, command.Type, command.CategoryId,
            command.FromPocketId, command.ToPocketId, command.SavingGoalId,
            command.RecurrenceRule, command.StartDate, firstOccurrence);

        if (created.IsFailed)
            return created.ToResult<int>();

        RecurringTransaction recurringTransaction = created.Value;

        await recurringTransactions.AddAsync(recurringTransaction, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(recurringTransaction.Id);
    }
}

using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.RecurringTransactions;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using FluentResults;
using Microsoft.Extensions.Logging;

namespace FinPlan.Application.RecurringTransactions.Commands.GenerateDueRecurringTransactions;

internal sealed class GenerateDueRecurringTransactionsHandler(
    IRecurringTransactionRepository recurringTransactions,
    ITransactionRepository transactions,
    ITransactionCategoryRepository categories,
    IPocketRepository pockets,
    ISavingGoalRepository savingGoals,
    IRecurrenceScheduler scheduler,
    IUnitOfWork unitOfWork,
    ILogger<GenerateDueRecurringTransactionsHandler> logger)
    : ICommandHandler<GenerateDueRecurringTransactionsCommand, Result<int>>
{
    public async Task<Result<int>> Handle(GenerateDueRecurringTransactionsCommand command, CancellationToken ct)
    {
        DateOnly today = command.Today;
        IReadOnlyList<RecurringTransaction> due = await recurringTransactions.GetDueAsync(today, ct);

        int createdCount = 0;

        foreach (RecurringTransaction recurring in due)
        {
            if (recurring.NextOccurrence is not { } cursor)
                continue;

            // A reference (pocket/category/goal) may have been soft-deleted since the definition
            // was created. Pause rather than emit a transaction pointing at a dead reference.
            Result references = await RecurringTransactionReferences.EnsureExist(
                categories, savingGoals, pockets,
                recurring.CategoryId, recurring.SavingGoalId,
                recurring.FromPocketId, recurring.ToPocketId, ct);

            if (references.IsFailed)
            {
                Pause(recurring, references.Errors[0].Message);
                continue;
            }

            // Catch-up: every occurrence from the cursor through today (one per missed period).
            IReadOnlyList<DateOnly> dueDates =
                scheduler.Between(recurring.StartDate, recurring.RecurrenceRule, cursor, today);

            bool paused = false;
            foreach (DateOnly date in dueDates)
            {
                Result<Transaction> occurrence = recurring.CreateOccurrence(date);

                // The template validated at creation; failing now means it became invalid. Pause it.
                if (occurrence.IsFailed)
                {
                    Pause(recurring, occurrence.Errors[0].Message);
                    paused = true;
                    break;
                }

                await transactions.AddAsync(occurrence.Value, ct);
                createdCount++;
            }

            if (paused)
                continue;

            DateOnly? next = scheduler.Next(recurring.StartDate, recurring.RecurrenceRule, today);
            DateOnly lastGenerated = dueDates.Count > 0
                ? dueDates[^1]
                : recurring.LastGeneratedDate ?? recurring.StartDate;
            recurring.MarkGenerated(lastGenerated, next);
        }

        // One unit of work per owner: the new transactions and the advanced cursors persist
        // atomically, so a re-run the same day finds nothing due (idempotent).
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(createdCount);
    }

    private void Pause(RecurringTransaction recurring, string reason)
    {
        logger.LogWarning("Pausing recurring transaction {Id}: {Reason}", recurring.Id, reason);
        recurring.Pause(reason);
    }
}

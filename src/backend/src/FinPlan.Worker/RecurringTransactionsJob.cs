using FinPlan.Application.Common.Messaging;
using FinPlan.Application.RecurringTransactions.Commands.GenerateDueRecurringTransactions;
using FinPlan.Domain.RecurringTransactions;
using FinPlan.Infrastructure;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace FinPlan.Worker;

// Daily job: discover which owners have due recurring definitions (one cross-owner query), then
// process each owner in its own scope with the owner context set, so the existing query filters
// and owner-stamping work exactly as they do for an HTTP request.
[DisallowConcurrentExecution]
internal sealed class RecurringTransactionsJob(
    IServiceScopeFactory scopeFactory,
    ILogger<RecurringTransactionsJob> logger) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        CancellationToken ct = context.CancellationToken;

        // Derived once so every owner in this run shares the same day boundary (UTC).
        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);

        IReadOnlyList<int> ownerIds = await DiscoverDueOwnersAsync(today, ct);

        logger.LogInformation(
            "Recurring transactions due for {OwnerCount} owner(s) on {Date}.", ownerIds.Count, today);

        foreach (int ownerId in ownerIds)
            await ProcessOwnerAsync(ownerId, today, ct);
    }

    private async Task<IReadOnlyList<int>> DiscoverDueOwnersAsync(DateOnly today, CancellationToken ct)
    {
        await using AsyncServiceScope scope = scopeFactory.CreateAsyncScope();

        IRecurringTransactionRepository repository =
            scope.ServiceProvider.GetRequiredService<IRecurringTransactionRepository>();

        return await repository.GetOwnerIdsWithDueAsync(today, ct);
    }

    private async Task ProcessOwnerAsync(int ownerId, DateOnly today, CancellationToken ct)
    {
        await using AsyncServiceScope scope = scopeFactory.CreateAsyncScope();

        AmbientCurrentOwnerProvider ownerProvider =
            scope.ServiceProvider.GetRequiredService<AmbientCurrentOwnerProvider>();

        // Setting the owner for the duration of the scope makes the scoped DbContext scope its
        // reads to this owner and stamp new transactions with it.
        using (ownerProvider.Use(ownerId))
        {
            ISender sender = scope.ServiceProvider.GetRequiredService<ISender>();

            try
            {
                Result<int> result = await sender.Send(
                    new GenerateDueRecurringTransactionsCommand(today), ct);

                if (result.IsFailed)
                    logger.LogError(
                        "Generation failed for owner {OwnerId}: {Errors}",
                        ownerId, string.Join("; ", result.Errors.Select(error => error.Message)));
                else
                    logger.LogInformation(
                        "Generated {Count} transaction(s) for owner {OwnerId}.", result.Value, ownerId);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                // Another run advanced the same cursor first; safe to skip — the cursor dedups.
                logger.LogWarning(ex, "Concurrency conflict for owner {OwnerId}; skipping.", ownerId);
            }
        }
    }
}

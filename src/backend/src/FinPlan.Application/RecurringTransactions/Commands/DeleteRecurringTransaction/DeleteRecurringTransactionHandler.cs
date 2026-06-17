using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.RecurringTransactions;
using FluentResults;

namespace FinPlan.Application.RecurringTransactions.Commands.DeleteRecurringTransaction;

internal sealed class DeleteRecurringTransactionHandler(
    IRecurringTransactionRepository recurringTransactions,
    IUnitOfWork unitOfWork) : ICommandHandler<DeleteRecurringTransactionCommand, Result>
{
    public async Task<Result> Handle(DeleteRecurringTransactionCommand command, CancellationToken ct)
    {
        RecurringTransaction? recurringTransaction = await recurringTransactions.GetByIdAsync(command.Id, ct);

        if (recurringTransaction is null)
            return Result.Fail($"Recurring transaction {command.Id} does not exist.");

        recurringTransactions.Remove(recurringTransaction);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

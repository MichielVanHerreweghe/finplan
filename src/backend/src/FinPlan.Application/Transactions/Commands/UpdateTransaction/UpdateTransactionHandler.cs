using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Commands.UpdateTransaction;

internal sealed class UpdateTransactionHandler(
    ITransactionRepository transactions,
    ITransactionCategoryRepository categories,
    IPocketRepository pockets,
    ISavingGoalRepository savingGoals,
    IUnitOfWork unitOfWork) : ICommandHandler<UpdateTransactionCommand, Result>
{
    public async Task<Result> Handle(UpdateTransactionCommand command, CancellationToken ct)
    {
        Transaction? transaction = await transactions.GetByIdAsync(command.Id, ct);

        if (transaction is null)
            return Result.Fail($"Transaction {command.Id} does not exist.");

        if (command.CategoryId is { } categoryId
            && await categories.GetByIdAsync(categoryId, ct) is null)
        {
            return Result.Fail($"Category {categoryId} does not exist.");
        }

        if (command.SavingGoalId is { } savingGoalId
            && await savingGoals.GetByIdAsync(savingGoalId, ct) is null)
        {
            return Result.Fail($"Saving goal {savingGoalId} does not exist.");
        }

        Result pocketsExist = await TransactionPockets.EnsureExist(
            pockets, command.FromPocketId, command.ToPocketId, ct);

        if (pocketsExist.IsFailed)
            return pocketsExist;

        Result updated = transaction.Update(
            command.Name, command.Date, command.Amount, command.Type, command.CategoryId,
            command.FromPocketId, command.ToPocketId, command.SavingGoalId);

        if (updated.IsFailed)
            return updated;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

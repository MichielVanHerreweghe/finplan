using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Pockets.Commands.DeletePocket;

internal sealed class DeletePocketHandler(
    IPocketRepository pockets,
    ITransactionRepository transactions,
    ISavingGoalRepository savingGoals,
    IUnitOfWork unitOfWork) : ICommandHandler<DeletePocketCommand, Result>
{
    public async Task<Result> Handle(DeletePocketCommand command, CancellationToken ct)
    {
        Pocket? pocket = await pockets.GetByIdAsync(command.Id, ct);

        if (pocket is null)
            return Result.Fail($"Pocket {command.Id} does not exist.");

        if (await pockets.HasChildrenAsync(command.Id, ct))
            return Result.Fail("Cannot delete a pocket that has nested pockets.");

        IReadOnlyDictionary<int, decimal> balances =
            await transactions.GetBalancesByPocketIdsAsync([command.Id], ct);

        decimal balance = pocket.StartingAmount + balances.GetValueOrDefault(command.Id);
        if (balance != 0)
            return Result.Fail("Cannot delete a pocket with a non-zero balance.");

        if (await savingGoals.ExistsForPocketAsync(command.Id, ct))
            return Result.Fail("Cannot delete a pocket linked to a saving goal.");

        pockets.Remove(pocket);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

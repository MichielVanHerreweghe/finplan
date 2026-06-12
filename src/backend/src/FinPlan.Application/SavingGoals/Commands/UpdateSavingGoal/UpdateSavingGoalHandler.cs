using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.SavingGoals;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Commands.UpdateSavingGoal;

internal sealed class UpdateSavingGoalHandler(
    ISavingGoalRepository savingGoals,
    IPocketRepository pockets,
    IUnitOfWork unitOfWork) : ICommandHandler<UpdateSavingGoalCommand, Result>
{
    public async Task<Result> Handle(UpdateSavingGoalCommand command, CancellationToken ct)
    {
        SavingGoal? savingGoal = await savingGoals.GetByIdAsync(command.Id, ct);

        if (savingGoal is null)
            return Result.Fail($"Saving goal {command.Id} does not exist.");

        if (await pockets.GetByIdAsync(command.PocketId, ct) is null)
            return Result.Fail($"Pocket {command.PocketId} does not exist.");

        Result updated = savingGoal.Update(
            command.Name, command.Description, command.TargetAmount, command.Deadline, command.PocketId);

        if (updated.IsFailed)
            return updated;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

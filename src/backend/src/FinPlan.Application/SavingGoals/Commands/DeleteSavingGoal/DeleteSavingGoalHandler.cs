using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.SavingGoals;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Commands.DeleteSavingGoal;

internal sealed class DeleteSavingGoalHandler(
    ISavingGoalRepository savingGoals,
    IUnitOfWork unitOfWork) : ICommandHandler<DeleteSavingGoalCommand, Result>
{
    public async Task<Result> Handle(DeleteSavingGoalCommand command, CancellationToken ct)
    {
        SavingGoal? savingGoal = await savingGoals.GetByIdAsync(command.Id, ct);

        if (savingGoal is null)
            return Result.Fail($"Saving goal {command.Id} does not exist.");

        savingGoals.Remove(savingGoal);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

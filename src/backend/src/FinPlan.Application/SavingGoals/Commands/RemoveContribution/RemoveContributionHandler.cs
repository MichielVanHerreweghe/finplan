using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.SavingGoals;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Commands.RemoveContribution;

internal sealed class RemoveContributionHandler(
    ISavingGoalRepository savingGoals,
    IUnitOfWork unitOfWork) : ICommandHandler<RemoveContributionCommand, Result>
{
    public async Task<Result> Handle(RemoveContributionCommand command, CancellationToken ct)
    {
        SavingGoal? savingGoal =
            await savingGoals.GetByIdWithContributionsAsync(command.SavingGoalId, ct);

        if (savingGoal is null)
            return Result.Fail($"Saving goal {command.SavingGoalId} does not exist.");

        Result removed = savingGoal.RemoveContribution(command.ContributionId);

        if (removed.IsFailed)
            return removed;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

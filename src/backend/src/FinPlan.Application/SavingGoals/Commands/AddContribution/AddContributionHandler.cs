using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.SavingGoals;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Commands.AddContribution;

internal sealed class AddContributionHandler(
    ISavingGoalRepository savingGoals,
    IUnitOfWork unitOfWork) : ICommandHandler<AddContributionCommand, Result>
{
    public async Task<Result> Handle(AddContributionCommand command, CancellationToken ct)
    {
        SavingGoal? savingGoal =
            await savingGoals.GetByIdWithContributionsAsync(command.SavingGoalId, ct);

        if (savingGoal is null)
            return Result.Fail($"Saving goal {command.SavingGoalId} does not exist.");

        Result added = savingGoal.AddContribution(command.Amount, command.Date);

        if (added.IsFailed)
            return added;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

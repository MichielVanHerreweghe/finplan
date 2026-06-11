using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.SavingGoals;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Commands.CreateSavingGoal;

internal sealed class CreateSavingGoalHandler(
    ISavingGoalRepository savingGoals,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateSavingGoalCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreateSavingGoalCommand command, CancellationToken ct)
    {
        Result<SavingGoal> created = SavingGoal.Create(
            command.Name, command.Description, command.TargetAmount, command.Deadline);

        if (created.IsFailed)
            return created.ToResult<int>();

        SavingGoal savingGoal = created.Value;

        await savingGoals.AddAsync(savingGoal, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(savingGoal.Id);
    }
}

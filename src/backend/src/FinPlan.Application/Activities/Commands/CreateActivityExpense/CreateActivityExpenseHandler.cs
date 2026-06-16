using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Activities;
using FluentResults;

namespace FinPlan.Application.Activities.Commands.CreateActivityExpense;

internal sealed class CreateActivityExpenseHandler(
    IActivityRepository activities,
    IActivityExpenseRepository expenses,
    ICurrentOwnerProvider currentOwner,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateActivityExpenseCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreateActivityExpenseCommand command, CancellationToken ct)
    {
        Activity? activity = await activities.GetByIdForUserAsync(command.ActivityId, currentOwner.CurrentOwnerId, ct);

        if (activity is null)
            return Result.Fail<int>($"Activity {command.ActivityId} does not exist.");

        if (!activity.HasMember(command.PaidByUserId))
            return Result.Fail<int>("The payer must be a member of the activity.");

        if (command.Splits.Any(split => !activity.HasMember(split.UserId)))
            return Result.Fail<int>("Everyone in the split must be a member of the activity.");

        IReadOnlyList<SplitParticipant> participants = command.Splits
            .Select(split => new SplitParticipant(split.UserId, split.ExactAmount, split.Percentage))
            .ToList();

        Result<ActivityExpense> created = ActivityExpense.Create(
            command.ActivityId,
            command.Description,
            command.Date,
            command.Amount,
            command.PaidByUserId,
            command.SplitType,
            participants);

        if (created.IsFailed)
            return created.ToResult<int>();

        await expenses.AddAsync(created.Value, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(created.Value.Id);
    }
}

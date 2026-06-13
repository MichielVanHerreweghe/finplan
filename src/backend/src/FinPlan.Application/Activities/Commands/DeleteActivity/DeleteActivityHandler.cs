using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Activities;
using FluentResults;

namespace FinPlan.Application.Activities.Commands.DeleteActivity;

internal sealed class DeleteActivityHandler(
    IActivityRepository activities,
    ICurrentOwnerProvider currentOwner,
    IUnitOfWork unitOfWork) : ICommandHandler<DeleteActivityCommand, Result>
{
    public async Task<Result> Handle(DeleteActivityCommand command, CancellationToken ct)
    {
        Activity? activity = await activities.GetByIdForUserAsync(command.Id, currentOwner.CurrentOwnerId, ct);

        if (activity is null)
            return Result.Fail($"Activity {command.Id} does not exist.");

        // Deleting the whole activity affects every member, so only the creator may do it.
        if (activity.CreatedByUserId != currentOwner.CurrentOwnerId)
            return Result.Fail("Only the activity creator can delete the activity.");

        activities.Remove(activity);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

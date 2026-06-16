using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Activities;
using FluentResults;

namespace FinPlan.Application.Activities.Commands.RemoveActivityMember;

internal sealed class RemoveActivityMemberHandler(
    IActivityRepository activities,
    ICurrentOwnerProvider currentOwner,
    IUnitOfWork unitOfWork) : ICommandHandler<RemoveActivityMemberCommand, Result>
{
    public async Task<Result> Handle(RemoveActivityMemberCommand command, CancellationToken ct)
    {
        Activity? activity = await activities.GetByIdForUserAsync(command.ActivityId, currentOwner.CurrentOwnerId, ct);

        if (activity is null)
            return Result.Fail($"Activity {command.ActivityId} does not exist.");

        Result removed = activity.RemoveMember(command.UserId);

        if (removed.IsFailed)
            return removed;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

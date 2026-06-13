using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Activities;
using FinPlan.Domain.Users;
using FluentResults;

namespace FinPlan.Application.Activities.Commands.AddActivityMember;

internal sealed class AddActivityMemberHandler(
    IActivityRepository activities,
    IUserRepository users,
    ICurrentOwnerProvider currentOwner,
    IUnitOfWork unitOfWork) : ICommandHandler<AddActivityMemberCommand, Result>
{
    public async Task<Result> Handle(AddActivityMemberCommand command, CancellationToken ct)
    {
        Activity? activity = await activities.GetByIdForUserAsync(command.ActivityId, currentOwner.CurrentOwnerId, ct);

        if (activity is null)
            return Result.Fail($"Activity {command.ActivityId} does not exist.");

        User? user = await users.GetByEmailAsync(command.Email, ct);

        if (user is null)
            return Result.Fail(
                $"No FinPlan user found with email '{command.Email}'. They need to sign in at least once first.");

        Result added = activity.AddMember(user.Id);

        if (added.IsFailed)
            return added;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

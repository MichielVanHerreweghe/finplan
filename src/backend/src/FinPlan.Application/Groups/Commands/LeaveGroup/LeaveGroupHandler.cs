using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Groups;
using FluentResults;

namespace FinPlan.Application.Groups.Commands.LeaveGroup;

internal sealed class LeaveGroupHandler(
    IGroupRepository groups,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<LeaveGroupCommand, Result>
{
    public async Task<Result> Handle(LeaveGroupCommand command, CancellationToken ct)
    {
        int userId = currentUser.CurrentUserId;
        Group? group = await groups.GetByIdForUserAsync(command.GroupId, userId, ct);

        if (group is null)
            return Result.Fail($"Group {command.GroupId} does not exist.");

        // RemoveMember refuses the creator — they must delete the group instead of leaving it.
        Result left = group.RemoveMember(userId);

        if (left.IsFailed)
            return left;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

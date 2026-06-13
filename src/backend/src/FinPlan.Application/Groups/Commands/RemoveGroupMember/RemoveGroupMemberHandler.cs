using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Groups;
using FluentResults;

namespace FinPlan.Application.Groups.Commands.RemoveGroupMember;

internal sealed class RemoveGroupMemberHandler(
    IGroupRepository groups,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<RemoveGroupMemberCommand, Result>
{
    public async Task<Result> Handle(RemoveGroupMemberCommand command, CancellationToken ct)
    {
        Group? group = await groups.GetByIdForUserAsync(command.GroupId, currentUser.CurrentUserId, ct);

        if (group is null)
            return Result.Fail($"Group {command.GroupId} does not exist.");

        Result removed = group.RemoveMember(command.UserId);

        if (removed.IsFailed)
            return removed;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

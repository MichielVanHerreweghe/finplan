using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Groups;
using FluentResults;

namespace FinPlan.Application.Groups.Commands.DeleteGroup;

internal sealed class DeleteGroupHandler(
    IGroupRepository groups,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<DeleteGroupCommand, Result>
{
    public async Task<Result> Handle(DeleteGroupCommand command, CancellationToken ct)
    {
        Group? group = await groups.GetByIdForUserAsync(command.GroupId, currentUser.CurrentUserId, ct);

        if (group is null)
            return Result.Fail($"Group {command.GroupId} does not exist.");

        // Deleting the whole group (and orphaning its shared finances) affects every member, so
        // only the creator may do it.
        if (group.CreatedByUserId != currentUser.CurrentUserId)
            return Result.Fail("Only the group creator can delete the group.");

        groups.Remove(group);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

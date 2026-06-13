using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Groups;
using FinPlan.Domain.Users;
using FluentResults;

namespace FinPlan.Application.Groups.Commands.AddGroupMember;

internal sealed class AddGroupMemberHandler(
    IGroupRepository groups,
    IUserRepository users,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<AddGroupMemberCommand, Result>
{
    public async Task<Result> Handle(AddGroupMemberCommand command, CancellationToken ct)
    {
        Group? group = await groups.GetByIdForUserAsync(command.GroupId, currentUser.CurrentUserId, ct);

        if (group is null)
            return Result.Fail($"Group {command.GroupId} does not exist.");

        User? user = await users.GetByEmailAsync(command.Email, ct);

        if (user is null)
            return Result.Fail(
                $"No FinPlan user found with email '{command.Email}'. They need to sign in at least once first.");

        Result added = group.AddMember(user.Id);

        if (added.IsFailed)
            return added;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

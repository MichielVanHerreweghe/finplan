using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Groups;
using FluentResults;

namespace FinPlan.Application.Groups.Commands.CreateGroup;

internal sealed class CreateGroupHandler(
    IGroupRepository groups,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateGroupCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreateGroupCommand command, CancellationToken ct)
    {
        Result<Group> created = Group.Create(command.Name, command.Description, currentUser.CurrentUserId);

        if (created.IsFailed)
            return created.ToResult<int>();

        // Persists the group together with its new Owner (Kind=Group) and the creator's
        // membership; EF stamps Group.OwnerId from the Owner navigation on insert.
        await groups.AddAsync(created.Value, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(created.Value.OwnerId);
    }
}

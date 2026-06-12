using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Pockets.Commands.CreatePocket;
using FinPlan.Domain.Common;
using FinPlan.Domain.Pockets;
using FluentResults;

namespace FinPlan.Application.Pockets.Commands.UpdatePocket;

internal sealed class UpdatePocketHandler(
    IPocketRepository pockets,
    IUnitOfWork unitOfWork) : ICommandHandler<UpdatePocketCommand, Result>
{
    public async Task<Result> Handle(UpdatePocketCommand command, CancellationToken ct)
    {
        Pocket? pocket = await pockets.GetByIdAsync(command.Id, ct);

        if (pocket is null)
            return Result.Fail($"Pocket {command.Id} does not exist.");

        if (command.ParentPocketId is { } parentId)
        {
            if (parentId == command.Id)
                return Result.Fail("A pocket cannot be its own parent.");

            // A pocket with children must stay top-level, otherwise its children would be two levels deep.
            if (await pockets.HasChildrenAsync(command.Id, ct))
                return Result.Fail("A pocket that has nested pockets cannot itself be nested.");

            Result parentCheck = await CreatePocketHandler.ValidateParent(pockets, parentId, ct);

            if (parentCheck.IsFailed)
                return parentCheck;
        }

        Result updated = pocket.Update(
            command.Name, command.Description, command.ParentPocketId, command.StartingAmount);

        if (updated.IsFailed)
            return updated;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

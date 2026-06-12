using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Pockets;
using FluentResults;

namespace FinPlan.Application.Pockets.Commands.CreatePocket;

internal sealed class CreatePocketHandler(
    IPocketRepository pockets,
    IUnitOfWork unitOfWork) : ICommandHandler<CreatePocketCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreatePocketCommand command, CancellationToken ct)
    {
        if (command.ParentPocketId is { } parentId)
        {
            Result parentCheck = await ValidateParent(pockets, parentId, ct);

            if (parentCheck.IsFailed)
                return parentCheck.ToResult<int>();
        }

        Result<Pocket> created = Pocket.Create(
            command.Name, command.Description, command.ParentPocketId, command.StartingAmount);

        if (created.IsFailed)
            return created.ToResult<int>();

        Pocket pocket = created.Value;

        await pockets.AddAsync(pocket, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(pocket.Id);
    }

    // A parent must exist and must itself be top-level, so nesting never exceeds one level.
    internal static async Task<Result> ValidateParent(IPocketRepository pockets, int parentId, CancellationToken ct)
    {
        Pocket? parent = await pockets.GetByIdAsync(parentId, ct);

        if (parent is null)
            return Result.Fail($"Parent pocket {parentId} does not exist.");

        if (parent.ParentPocketId is not null)
            return Result.Fail("Pockets can only be nested one level deep.");

        return Result.Ok();
    }
}

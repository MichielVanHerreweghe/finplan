using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Activities;
using FluentResults;

namespace FinPlan.Application.Activities.Commands.CreateActivity;

internal sealed class CreateActivityHandler(
    IActivityRepository activities,
    ICurrentOwnerProvider currentOwner,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateActivityCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreateActivityCommand command, CancellationToken ct)
    {
        Result<Activity> created = Activity.Create(command.Name, command.Description, currentOwner.CurrentOwnerId);

        if (created.IsFailed)
            return created.ToResult<int>();

        await activities.AddAsync(created.Value, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(created.Value.Id);
    }
}

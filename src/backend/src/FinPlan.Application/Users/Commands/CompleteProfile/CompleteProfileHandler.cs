using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Users;
using FluentResults;

namespace FinPlan.Application.Users.Commands.CompleteProfile;

internal sealed class CompleteProfileHandler(
    IUserRepository users,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<CompleteProfileCommand, Result>
{
    public async Task<Result> Handle(CompleteProfileCommand command, CancellationToken ct)
    {
        User? user = await users.GetByIdAsync(currentUser.CurrentUserId, ct);

        if (user is null)
            return Result.Fail("Current user could not be resolved.");

        Result completed = user.CompleteProfile(command.FirstName, command.LastName);

        if (completed.IsFailed)
            return completed;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}

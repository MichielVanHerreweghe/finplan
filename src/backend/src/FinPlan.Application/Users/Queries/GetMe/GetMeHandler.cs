using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Users.Contracts;
using FinPlan.Domain.Common;
using FinPlan.Domain.Users;
using FluentResults;

namespace FinPlan.Application.Users.Queries.GetMe;

// The acting user's own profile, for the onboarding gate and account screen.
internal sealed class GetMeHandler(
    IUserRepository users,
    ICurrentUserProvider currentUser)
    : IQueryHandler<GetMeQuery, Result<UserProfileResponse>>
{
    public async Task<Result<UserProfileResponse>> Handle(GetMeQuery query, CancellationToken ct)
    {
        User? user = await users.GetByIdAsync(currentUser.CurrentUserId, ct);

        if (user is null)
            return Result.Fail("Current user could not be resolved.");

        return Result.Ok(user.ToProfileResponse());
    }
}

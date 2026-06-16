using FinPlan.Domain.Users;

namespace FinPlan.Application.Users.Contracts;

public sealed record UserProfileResponse(
    int Id,
    string? Email,
    string? DisplayName,
    string? FirstName,
    string? LastName,
    bool ProfileCompleted);

internal static class UserMapping
{
    public static UserProfileResponse ToProfileResponse(this User user) =>
        new(user.Id, user.Email, user.DisplayName, user.FirstName, user.LastName, user.ProfileCompleted);
}

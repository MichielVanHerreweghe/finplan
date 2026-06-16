using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Users.Contracts;
using FluentResults;

namespace FinPlan.Application.Users.Queries.GetMe;

public sealed record GetMeQuery : IQuery<Result<UserProfileResponse>>;

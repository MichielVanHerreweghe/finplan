using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Activities.Contracts;
using FluentResults;

namespace FinPlan.Application.Activities.Queries.GetActivity;

public sealed record GetActivityQuery(int Id) : IQuery<Result<ActivityResponse>>;

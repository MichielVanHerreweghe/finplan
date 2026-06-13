using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Activities.Contracts;
using FluentResults;

namespace FinPlan.Application.Activities.Queries.GetActivities;

public sealed record GetActivitiesQuery : IQuery<Result<IReadOnlyList<ActivityResponse>>>;

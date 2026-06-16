using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Common.Queries;
using FinPlan.Application.Activities.Contracts;
using FluentResults;

namespace FinPlan.Application.Activities.Queries.GetActivities;

public sealed record GetActivitiesQuery(
    string? Search = null,
    NameSort Sort = NameSort.NameAsc)
    : IQuery<Result<IReadOnlyList<ActivityResponse>>>;

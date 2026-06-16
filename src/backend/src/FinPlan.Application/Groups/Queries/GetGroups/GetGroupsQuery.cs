using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Common.Queries;
using FinPlan.Application.Groups.Contracts;
using FluentResults;

namespace FinPlan.Application.Groups.Queries.GetGroups;

public sealed record GetGroupsQuery(
    string? Search = null,
    NameSort Sort = NameSort.NameAsc)
    : IQuery<Result<IReadOnlyList<GroupResponse>>>;

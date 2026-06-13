using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Groups.Contracts;
using FluentResults;

namespace FinPlan.Application.Groups.Queries.GetGroups;

public sealed record GetGroupsQuery : IQuery<Result<IReadOnlyList<GroupResponse>>>;

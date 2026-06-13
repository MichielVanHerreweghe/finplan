using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Groups.Contracts;
using FluentResults;

namespace FinPlan.Application.Groups.Queries.GetMyContexts;

public sealed record GetMyContextsQuery : IQuery<Result<IReadOnlyList<OwnerContextResponse>>>;

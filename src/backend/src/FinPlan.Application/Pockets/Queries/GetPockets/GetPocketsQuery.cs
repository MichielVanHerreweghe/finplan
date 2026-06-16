using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Pockets.Contracts;
using FluentResults;

namespace FinPlan.Application.Pockets.Queries.GetPockets;

public sealed record GetPocketsQuery(
    string? Search = null,
    PocketSort Sort = PocketSort.NameAsc)
    : IQuery<Result<IReadOnlyList<PocketResponse>>>;

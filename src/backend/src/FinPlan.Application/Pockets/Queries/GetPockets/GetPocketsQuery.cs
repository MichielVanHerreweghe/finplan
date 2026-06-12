using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Pockets.Contracts;
using FluentResults;

namespace FinPlan.Application.Pockets.Queries.GetPockets;

public sealed record GetPocketsQuery : IQuery<Result<IReadOnlyList<PocketResponse>>>;

using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Pockets.Contracts;
using FluentResults;

namespace FinPlan.Application.Pockets.Queries.GetPocketsByIds;

// Batch read backing the Transaction.fromPocket/toPocket DataLoader. The DataLoader collects
// every distinct pocket id requested in a single GraphQL operation and resolves them in one query.
public sealed record GetPocketsByIdsQuery(IReadOnlyList<int> Ids)
    : IQuery<Result<IReadOnlyList<PocketResponse>>>;

using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Pockets.Contracts;
using FluentResults;

namespace FinPlan.Application.Pockets.Queries.GetPocketById;

public sealed record GetPocketByIdQuery(int Id) : IQuery<Result<PocketResponse>>;

using FinPlan.Application.Common.Messaging;
using FinPlan.Application.SavingGoals.Contracts;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Queries.GetSavingGoalById;

public sealed record GetSavingGoalByIdQuery(int Id) : IQuery<Result<SavingGoalResponse>>;

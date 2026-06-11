using FinPlan.Application.Common.Messaging;
using FinPlan.Application.SavingGoals.Contracts;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Queries.GetSavingGoals;

public sealed record GetSavingGoalsQuery : IQuery<Result<IReadOnlyList<SavingGoalResponse>>>;

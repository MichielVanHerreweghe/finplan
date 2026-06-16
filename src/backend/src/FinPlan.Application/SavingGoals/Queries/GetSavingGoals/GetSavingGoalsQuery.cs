using FinPlan.Application.Common.Messaging;
using FinPlan.Application.SavingGoals.Contracts;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Queries.GetSavingGoals;

public sealed record GetSavingGoalsQuery(
    string? Search = null,
    SavingGoalStatus Status = SavingGoalStatus.All,
    SavingGoalSort Sort = SavingGoalSort.NameAsc)
    : IQuery<Result<IReadOnlyList<SavingGoalResponse>>>;

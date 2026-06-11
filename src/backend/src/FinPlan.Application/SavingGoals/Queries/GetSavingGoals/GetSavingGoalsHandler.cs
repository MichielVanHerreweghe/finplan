using FinPlan.Application.Common.Messaging;
using FinPlan.Application.SavingGoals.Contracts;
using FinPlan.Domain.SavingGoals;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Queries.GetSavingGoals;

internal sealed class GetSavingGoalsHandler(ISavingGoalRepository savingGoals)
    : IQueryHandler<GetSavingGoalsQuery, Result<IReadOnlyList<SavingGoalResponse>>>
{
    public async Task<Result<IReadOnlyList<SavingGoalResponse>>> Handle(
        GetSavingGoalsQuery query, CancellationToken ct)
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);

        IReadOnlyList<SavingGoal> entities = await savingGoals.GetWithContributionsAsync(ct);

        IReadOnlyList<SavingGoalResponse> response = entities
            .Select(goal => goal.ToResponse(today))
            .ToList();

        return Result.Ok(response);
    }
}

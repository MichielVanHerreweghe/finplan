using FinPlan.Application.Common.Messaging;
using FinPlan.Application.SavingGoals.Contracts;
using FinPlan.Domain.SavingGoals;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Queries.GetSavingGoalById;

internal sealed class GetSavingGoalByIdHandler(ISavingGoalRepository savingGoals)
    : IQueryHandler<GetSavingGoalByIdQuery, Result<SavingGoalResponse>>
{
    public async Task<Result<SavingGoalResponse>> Handle(GetSavingGoalByIdQuery query, CancellationToken ct)
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);

        SavingGoal? savingGoal = await savingGoals.GetByIdWithContributionsAsync(query.Id, ct);

        return savingGoal is null
            ? Result.Fail($"Saving goal {query.Id} does not exist.")
            : Result.Ok(savingGoal.ToResponse(today));
    }
}

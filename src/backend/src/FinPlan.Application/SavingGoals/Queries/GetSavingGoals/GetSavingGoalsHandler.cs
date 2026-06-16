using FinPlan.Application.Common.Messaging;
using FinPlan.Application.SavingGoals.Contracts;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Queries.GetSavingGoals;

internal sealed class GetSavingGoalsHandler(
    ISavingGoalRepository savingGoals,
    ITransactionRepository transactions)
    : IQueryHandler<GetSavingGoalsQuery, Result<IReadOnlyList<SavingGoalResponse>>>
{
    public async Task<Result<IReadOnlyList<SavingGoalResponse>>> Handle(
        GetSavingGoalsQuery query, CancellationToken ct)
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);

        IReadOnlyList<SavingGoal> entities = await savingGoals.GetAsync(ct);

        int[] goalIds = entities.Select(goal => goal.Id).ToArray();
        IReadOnlyDictionary<int, decimal> saved =
            await transactions.GetSavedAmountsByGoalIdsAsync(goalIds, ct);

        IEnumerable<SavingGoalResponse> goals = entities
            .Select(goal => goal.ToResponse(today, saved.GetValueOrDefault(goal.Id)));

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            string term = query.Search.Trim();
            goals = goals.Where(goal =>
                goal.Name.Contains(term, StringComparison.OrdinalIgnoreCase)
                || (goal.Description?.Contains(term, StringComparison.OrdinalIgnoreCase) ?? false));
        }

        goals = query.Status switch
        {
            SavingGoalStatus.Active => goals.Where(goal => !goal.IsCompleted),
            SavingGoalStatus.Completed => goals.Where(goal => goal.IsCompleted),
            SavingGoalStatus.Overdue => goals.Where(goal => goal.IsOverdue),
            _ => goals,
        };

        goals = query.Sort switch
        {
            SavingGoalSort.DeadlineAsc => goals
                .OrderBy(goal => goal.Deadline is null)
                .ThenBy(goal => goal.Deadline)
                .ThenBy(goal => goal.Name, StringComparer.OrdinalIgnoreCase),
            SavingGoalSort.ProgressDesc => goals
                .OrderByDescending(goal =>
                    goal.TargetAmount > 0 ? goal.SavedAmount / goal.TargetAmount : 0m),
            SavingGoalSort.TargetDesc => goals.OrderByDescending(goal => goal.TargetAmount),
            SavingGoalSort.RemainingAsc => goals.OrderBy(goal => goal.RemainingAmount),
            _ => goals.OrderBy(goal => goal.Name, StringComparer.OrdinalIgnoreCase),
        };

        IReadOnlyList<SavingGoalResponse> response = goals.ToList();

        return Result.Ok(response);
    }
}

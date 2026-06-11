using FinPlan.Application.Common.Messaging;
using FinPlan.Application.SavingGoals.Contracts;
using FinPlan.Application.SavingGoals.Queries.GetSavingGoalById;
using FinPlan.Application.SavingGoals.Queries.GetSavingGoals;

namespace FinPlan.Api.GraphQL.Queries;

public partial class Query
{
    public async Task<IReadOnlyList<SavingGoalResponse>> GetSavingGoals(
        ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetSavingGoalsQuery(), ct)).Unwrap();

    public async Task<SavingGoalResponse?> GetSavingGoal(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetSavingGoalByIdQuery(id), ct)).UnwrapOrNull();
}

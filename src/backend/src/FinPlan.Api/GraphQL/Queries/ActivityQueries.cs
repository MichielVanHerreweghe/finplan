using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Common.Queries;
using FinPlan.Application.Activities.Contracts;
using FinPlan.Application.Activities.Queries.GetActivity;
using FinPlan.Application.Activities.Queries.GetActivityExpenses;
using FinPlan.Application.Activities.Queries.GetActivities;

namespace FinPlan.Api.GraphQL.Queries;

public partial class Query
{
    public async Task<IReadOnlyList<ActivityResponse>> GetActivities(
        ISender sender, CancellationToken ct,
        string? search = null,
        NameSort sort = NameSort.NameAsc) =>
        (await sender.Send(new GetActivitiesQuery(search, sort), ct)).Unwrap();

    public async Task<ActivityResponse?> GetActivity(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetActivityQuery(id), ct)).UnwrapOrNull();

    public async Task<IReadOnlyList<ActivityExpenseResponse>> GetActivityExpenses(
        int activityId, ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetActivityExpensesQuery(activityId), ct)).Unwrap();
}

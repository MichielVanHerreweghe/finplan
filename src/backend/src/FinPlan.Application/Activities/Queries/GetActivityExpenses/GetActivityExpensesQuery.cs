using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Activities.Contracts;
using FluentResults;

namespace FinPlan.Application.Activities.Queries.GetActivityExpenses;

public sealed record GetActivityExpensesQuery(int ActivityId) : IQuery<Result<IReadOnlyList<ActivityExpenseResponse>>>;

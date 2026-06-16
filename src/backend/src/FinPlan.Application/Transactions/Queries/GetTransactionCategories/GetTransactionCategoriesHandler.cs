using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Common.Queries;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionCategories;

internal sealed class GetTransactionCategoriesHandler(ITransactionCategoryRepository categories)
    : IQueryHandler<GetTransactionCategoriesQuery, Result<IReadOnlyList<TransactionCategoryResponse>>>
{
    public async Task<Result<IReadOnlyList<TransactionCategoryResponse>>> Handle(
        GetTransactionCategoriesQuery query, CancellationToken ct)
    {
        IReadOnlyList<TransactionCategory> entities = await categories.GetAsync(ct);

        IEnumerable<TransactionCategory> filtered = entities;
        if (!string.IsNullOrWhiteSpace(query.Search))
            filtered = filtered.Where(category =>
                category.Name.Contains(query.Search.Trim(), StringComparison.OrdinalIgnoreCase));

        filtered = query.Sort == NameSort.NameDesc
            ? filtered.OrderByDescending(category => category.Name, StringComparer.OrdinalIgnoreCase)
            : filtered.OrderBy(category => category.Name, StringComparer.OrdinalIgnoreCase);

        IReadOnlyList<TransactionCategoryResponse> response = filtered
            .Select(category => category.ToResponse())
            .ToList();

        return Result.Ok(response);
    }
}

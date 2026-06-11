using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Application.Transactions.Queries.GetTransactionCategories;
using FinPlan.Application.Transactions.Queries.GetTransactionCategoryById;

namespace FinPlan.Api.GraphQL.Queries;

public partial class Query
{
    public async Task<IReadOnlyList<TransactionCategoryResponse>> GetTransactionCategories(
        ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetTransactionCategoriesQuery(), ct)).Unwrap();

    public async Task<TransactionCategoryResponse?> GetTransactionCategory(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetTransactionCategoryByIdQuery(id), ct)).UnwrapOrNull();
}

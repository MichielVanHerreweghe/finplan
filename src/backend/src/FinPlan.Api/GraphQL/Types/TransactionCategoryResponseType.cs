using FinPlan.Api.GraphQL.DataLoaders;
using FinPlan.Application.Transactions.Contracts;
using HotChocolate;
using HotChocolate.Types;

namespace FinPlan.Api.GraphQL.Types;

// Adds the `transactions` relation to the TransactionCategory type. The client opts in by selecting
// it; the grouped DataLoader returns an empty list for a category with no transactions.
[ExtendObjectType(typeof(TransactionCategoryResponse))]
internal sealed class TransactionCategoryResponseType
{
    public async Task<IEnumerable<TransactionResponse>> GetTransactions(
        [Parent] TransactionCategoryResponse category,
        TransactionsByCategoryIdDataLoader transactionsByCategoryId,
        CancellationToken ct) =>
        await transactionsByCategoryId.LoadAsync(category.Id, ct);
}

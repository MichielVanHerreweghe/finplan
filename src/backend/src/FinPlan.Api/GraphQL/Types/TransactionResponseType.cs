using FinPlan.Api.GraphQL.DataLoaders;
using FinPlan.Application.Transactions.Contracts;
using HotChocolate;
using HotChocolate.Types;

namespace FinPlan.Api.GraphQL.Types;

// Adds the `category` relation to the Transaction type. The client opts in purely by selecting it;
// an uncategorized transaction (null CategoryId) resolves to null without touching the DataLoader.
[ExtendObjectType(typeof(TransactionResponse))]
internal sealed class TransactionResponseType
{
    public async Task<TransactionCategoryResponse?> GetCategory(
        [Parent] TransactionResponse transaction,
        CategoryByIdDataLoader categoryById,
        CancellationToken ct) =>
        transaction.CategoryId is int categoryId
            ? await categoryById.LoadAsync(categoryId, ct)
            : null;
}

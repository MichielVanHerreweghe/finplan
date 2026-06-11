using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Application.Transactions.Queries.GetTransactionCategoriesByIds;
using FinPlan.Application.Transactions.Queries.GetTransactionsByCategoryIds;
using GreenDonut;

namespace FinPlan.Api.GraphQL.DataLoaders;

// Each DataLoader collects the keys requested across one GraphQL operation and resolves them in a
// single batched read, so nesting relations never triggers an N+1. A fresh DI scope per batch gives
// the dispatched query its own DbContext, independent of the per-resolver scopes the schema uses.

internal sealed class CategoryByIdDataLoader(
    IServiceScopeFactory scopeFactory,
    IBatchScheduler batchScheduler,
    DataLoaderOptions options)
    : BatchDataLoader<int, TransactionCategoryResponse>(batchScheduler, options)
{
    protected override async Task<IReadOnlyDictionary<int, TransactionCategoryResponse>> LoadBatchAsync(
        IReadOnlyList<int> keys, CancellationToken ct)
    {
        using IServiceScope scope = scopeFactory.CreateScope();
        ISender sender = scope.ServiceProvider.GetRequiredService<ISender>();

        IReadOnlyList<TransactionCategoryResponse> categories =
            (await sender.Send(new GetTransactionCategoriesByIdsQuery(keys), ct)).Unwrap();

        return categories.ToDictionary(category => category.Id);
    }
}

internal sealed class TransactionsByCategoryIdDataLoader(
    IServiceScopeFactory scopeFactory,
    IBatchScheduler batchScheduler,
    DataLoaderOptions options)
    : GroupedDataLoader<int, TransactionResponse>(batchScheduler, options)
{
    protected override async Task<ILookup<int, TransactionResponse>> LoadGroupedBatchAsync(
        IReadOnlyList<int> keys, CancellationToken ct)
    {
        using IServiceScope scope = scopeFactory.CreateScope();
        ISender sender = scope.ServiceProvider.GetRequiredService<ISender>();

        IReadOnlyList<TransactionResponse> transactions =
            (await sender.Send(new GetTransactionsByCategoryIdsQuery(keys), ct)).Unwrap();

        // CategoryId is guaranteed non-null here: the query only returns transactions
        // whose CategoryId is one of the requested keys.
        return transactions.ToLookup(transaction => transaction.CategoryId!.Value);
    }
}

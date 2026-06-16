using FinPlan.Domain.Transactions;

namespace FinPlan.Application.Transactions.Queries.GetTransactions;

/// <summary>
/// Server-side search/filter/sort applied in the read pipeline over the
/// owner-scoped transaction set (the DbContext query filter has already
/// restricted these to the current owner).
/// </summary>
public static class TransactionQueryExtensions
{
    public static IEnumerable<Transaction> ApplySearch(
        this IEnumerable<Transaction> source, string? search) =>
        string.IsNullOrWhiteSpace(search)
            ? source
            : source.Where(t =>
                t.Name.Contains(search.Trim(), StringComparison.OrdinalIgnoreCase));

    public static IEnumerable<Transaction> ApplyType(
        this IEnumerable<Transaction> source, TransactionType? type) =>
        type is null or TransactionType.Undefined
            ? source
            : source.Where(t => t.Type == type);

    public static IEnumerable<Transaction> ApplyCategory(
        this IEnumerable<Transaction> source, int? categoryId, bool uncategorized) =>
        uncategorized
            ? source.Where(t => t.CategoryId is null)
            : categoryId is { } id
                ? source.Where(t => t.CategoryId == id)
                : source;

    public static IEnumerable<Transaction> ApplyDateRange(
        this IEnumerable<Transaction> source, DateOnly? from, DateOnly? to)
    {
        if (from is { } f) source = source.Where(t => t.Date >= f);
        if (to is { } t2) source = source.Where(t => t.Date <= t2);
        return source;
    }

    public static IEnumerable<Transaction> ApplySort(
        this IEnumerable<Transaction> source, TransactionSort sort) =>
        sort switch
        {
            TransactionSort.DateAsc => source.OrderBy(t => t.Date).ThenBy(t => t.Id),
            TransactionSort.AmountDesc => source.OrderByDescending(t => t.Amount).ThenByDescending(t => t.Id),
            TransactionSort.AmountAsc => source.OrderBy(t => t.Amount).ThenBy(t => t.Id),
            TransactionSort.NameAsc => source.OrderBy(t => t.Name, StringComparer.OrdinalIgnoreCase),
            TransactionSort.NameDesc => source.OrderByDescending(t => t.Name, StringComparer.OrdinalIgnoreCase),
            _ => source.OrderByDescending(t => t.Date).ThenByDescending(t => t.Id),
        };
}

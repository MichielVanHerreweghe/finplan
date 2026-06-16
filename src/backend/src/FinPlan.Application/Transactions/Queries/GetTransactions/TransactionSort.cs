namespace FinPlan.Application.Transactions.Queries.GetTransactions;

/// <summary>Server-side ordering options for transaction lists.</summary>
public enum TransactionSort
{
    DateDesc = 0,
    DateAsc,
    AmountDesc,
    AmountAsc,
    NameAsc,
    NameDesc,
}

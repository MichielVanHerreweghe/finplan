namespace FinPlan.Domain.Contacts;

// The one-on-one expense ledger between user pairs. Both aggregates (expenses and settlements) are
// keyed on the canonical pair and have no owner query filter, so every read MUST constrain by the
// pair (or by "user is in the pair") to avoid leaking other people's ledgers.
public interface IContactLedgerRepository
{
    Task<IReadOnlyList<ContactExpense>> GetExpensesForPairAsync(
        int userAId, int userBId, CancellationToken ct = default);

    Task<IReadOnlyList<ContactSettlement>> GetSettlementsForPairAsync(
        int userAId, int userBId, CancellationToken ct = default);

    // Everything involving the user, for computing per-contact balances on the contacts list.
    Task<IReadOnlyList<ContactExpense>> GetAllExpensesForUserAsync(int userId, CancellationToken ct = default);
    Task<IReadOnlyList<ContactSettlement>> GetAllSettlementsForUserAsync(int userId, CancellationToken ct = default);

    Task<ContactExpense?> GetExpenseByIdAsync(int id, CancellationToken ct = default);
    Task<ContactSettlement?> GetSettlementByIdAsync(int id, CancellationToken ct = default);

    Task AddExpenseAsync(ContactExpense expense, CancellationToken ct = default);
    Task AddSettlementAsync(ContactSettlement settlement, CancellationToken ct = default);

    void RemoveExpense(ContactExpense expense);
    void RemoveSettlement(ContactSettlement settlement);
}

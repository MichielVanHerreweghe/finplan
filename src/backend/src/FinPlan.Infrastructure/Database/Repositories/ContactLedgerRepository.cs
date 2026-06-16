using FinPlan.Domain.Contacts;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

// Reads/writes the one-on-one ledger. Expenses and settlements have no owner query filter, so
// every read is constrained by the canonical pair (or by "user is in the pair").
internal sealed class ContactLedgerRepository : IContactLedgerRepository
{
    private readonly ApplicationDbContext _context;
    private readonly DbSet<ContactExpense> _expenses;
    private readonly DbSet<ContactSettlement> _settlements;

    public ContactLedgerRepository(ApplicationDbContext context)
    {
        _context = context;
        _expenses = context.Set<ContactExpense>();
        _settlements = context.Set<ContactSettlement>();
    }

    public async Task<IReadOnlyList<ContactExpense>> GetExpensesForPairAsync(
        int userAId, int userBId, CancellationToken ct = default) =>
        await _expenses
            .Include(expense => expense.Splits)
            .Where(expense => expense.UserAId == userAId && expense.UserBId == userBId)
            .OrderByDescending(expense => expense.Date)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<ContactSettlement>> GetSettlementsForPairAsync(
        int userAId, int userBId, CancellationToken ct = default) =>
        await _settlements
            .Where(settlement => settlement.UserAId == userAId && settlement.UserBId == userBId)
            .OrderByDescending(settlement => settlement.Date)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<ContactExpense>> GetAllExpensesForUserAsync(
        int userId, CancellationToken ct = default) =>
        await _expenses
            .Include(expense => expense.Splits)
            .Where(expense => expense.UserAId == userId || expense.UserBId == userId)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<ContactSettlement>> GetAllSettlementsForUserAsync(
        int userId, CancellationToken ct = default) =>
        await _settlements
            .Where(settlement => settlement.UserAId == userId || settlement.UserBId == userId)
            .ToListAsync(ct);

    public Task<ContactExpense?> GetExpenseByIdAsync(int id, CancellationToken ct = default) =>
        _expenses
            .Include(expense => expense.Splits)
            .FirstOrDefaultAsync(expense => expense.Id == id, ct);

    public Task<ContactSettlement?> GetSettlementByIdAsync(int id, CancellationToken ct = default) =>
        _settlements.FirstOrDefaultAsync(settlement => settlement.Id == id, ct);

    public async Task AddExpenseAsync(ContactExpense expense, CancellationToken ct = default) =>
        await _expenses.AddAsync(expense, ct);

    public async Task AddSettlementAsync(ContactSettlement settlement, CancellationToken ct = default) =>
        await _settlements.AddAsync(settlement, ct);

    // Soft delete: flips DeletedAt; the global query filter then hides the row.
    public void RemoveExpense(ContactExpense expense) => expense.Delete();

    public void RemoveSettlement(ContactSettlement settlement) => settlement.Delete();
}

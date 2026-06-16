using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Common.Queries;
using FinPlan.Application.Contacts.Contracts;
using FinPlan.Domain.Common;
using FinPlan.Domain.Contacts;
using FinPlan.Domain.Users;
using FluentResults;

namespace FinPlan.Application.Contacts.Queries.GetContacts;

// The acting user's contacts, with each contact resolved to its display name/email — for the
// contacts page and the activity/group quick-add picker. Scoped by OwnerUserId, independent of
// the active owner context.
internal sealed class GetContactsHandler(
    IContactRepository contacts,
    IContactLedgerRepository ledger,
    IUserRepository users,
    ICurrentUserProvider currentUser)
    : IQueryHandler<GetContactsQuery, Result<IReadOnlyList<ContactResponse>>>
{
    public async Task<Result<IReadOnlyList<ContactResponse>>> Handle(
        GetContactsQuery query, CancellationToken ct)
    {
        int currentUserId = currentUser.CurrentUserId;
        IReadOnlyList<Contact> entities = await contacts.GetForUserAsync(currentUserId, ct);

        int[] userIds = entities.Select(contact => contact.ContactUserId).Distinct().ToArray();
        IReadOnlyDictionary<int, User> usersById =
            (await users.GetByIdsAsync(userIds, ct)).ToDictionary(user => user.Id);

        // One-on-one net balance per counterparty, computed once over the user's whole ledger.
        IReadOnlyList<ContactExpense> expenses = await ledger.GetAllExpensesForUserAsync(currentUserId, ct);
        IReadOnlyList<ContactSettlement> settlements = await ledger.GetAllSettlementsForUserAsync(currentUserId, ct);
        IReadOnlyDictionary<int, decimal> netByUser =
            ContactBalance.NetByCounterparty(currentUserId, expenses, settlements);

        IEnumerable<ContactResponse> result = entities
            .Select(contact => contact.ToResponse(usersById, netByUser.GetValueOrDefault(contact.ContactUserId, 0m)));

        if (!string.IsNullOrWhiteSpace(query.Search))
            result = result.Where(contact =>
                SortKey(contact).Contains(query.Search.Trim(), StringComparison.OrdinalIgnoreCase));

        result = query.Sort == NameSort.NameDesc
            ? result.OrderByDescending(SortKey, StringComparer.OrdinalIgnoreCase)
            : result.OrderBy(SortKey, StringComparer.OrdinalIgnoreCase);

        IReadOnlyList<ContactResponse> response = result.ToList();

        return Result.Ok(response);
    }

    private static string SortKey(ContactResponse contact) =>
        contact.DisplayName ?? contact.Email ?? string.Empty;
}

using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Contacts.Contracts;
using FinPlan.Domain.Common;
using FinPlan.Domain.Contacts;
using FinPlan.Domain.Users;
using FluentResults;

namespace FinPlan.Application.Contacts.Queries.GetContactLedger;

// The full one-on-one ledger with a contact: the other person, the current user's net balance, and
// the combined expense + settlement history (each already sorted by date descending in the repo).
internal sealed class GetContactLedgerHandler(
    IContactRepository contacts,
    IContactLedgerRepository ledger,
    IUserRepository users,
    ICurrentUserProvider currentUser)
    : IQueryHandler<GetContactLedgerQuery, Result<ContactLedgerResponse>>
{
    public async Task<Result<ContactLedgerResponse>> Handle(GetContactLedgerQuery query, CancellationToken ct)
    {
        Contact? contact = await contacts.GetByIdAsync(query.ContactId, ct);

        if (contact is null || contact.OwnerUserId != currentUser.CurrentUserId)
            return Result.Fail($"Contact {query.ContactId} does not exist.");

        int currentUserId = currentUser.CurrentUserId;
        int otherUserId = contact.ContactUserId;
        ContactPair pair = ContactPair.Of(currentUserId, otherUserId);

        IReadOnlyList<ContactExpense> expenses = await ledger.GetExpensesForPairAsync(pair.A, pair.B, ct);
        IReadOnlyList<ContactSettlement> settlements = await ledger.GetSettlementsForPairAsync(pair.A, pair.B, ct);

        decimal net = ContactBalance
            .NetByCounterparty(currentUserId, expenses, settlements)
            .GetValueOrDefault(otherUserId, 0m);

        User? other = await users.GetByIdAsync(otherUserId, ct);

        ContactLedgerResponse response = new(
            contact.Id,
            otherUserId,
            other?.DisplayName,
            other?.FirstName,
            other?.LastName,
            other?.Email,
            net,
            expenses.Select(expense => expense.ToResponse()).ToList(),
            settlements.Select(settlement => settlement.ToResponse()).ToList());

        return Result.Ok(response);
    }
}

using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Common.Queries;
using FinPlan.Application.Contacts.Contracts;
using FinPlan.Application.Contacts.Queries.GetContactLedger;
using FinPlan.Application.Contacts.Queries.GetContacts;

namespace FinPlan.Api.GraphQL.Queries;

public partial class Query
{
    // The current user's contacts, for the contacts page and the member quick-add picker.
    public async Task<IReadOnlyList<ContactResponse>> GetContacts(
        ISender sender, CancellationToken ct,
        string? search = null,
        NameSort sort = NameSort.NameAsc) =>
        (await sender.Send(new GetContactsQuery(search, sort), ct)).Unwrap();

    // The one-on-one expense ledger with a contact: balance + expense/settlement history.
    public async Task<ContactLedgerResponse> GetContactLedger(
        int contactId, ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetContactLedgerQuery(contactId), ct)).Unwrap();
}

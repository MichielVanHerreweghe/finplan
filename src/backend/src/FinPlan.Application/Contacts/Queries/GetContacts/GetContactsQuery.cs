using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Common.Queries;
using FinPlan.Application.Contacts.Contracts;
using FluentResults;

namespace FinPlan.Application.Contacts.Queries.GetContacts;

public sealed record GetContactsQuery(
    string? Search = null,
    NameSort Sort = NameSort.NameAsc)
    : IQuery<Result<IReadOnlyList<ContactResponse>>>;

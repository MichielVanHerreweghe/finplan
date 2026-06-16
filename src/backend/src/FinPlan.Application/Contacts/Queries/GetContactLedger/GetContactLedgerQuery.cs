using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Contacts.Contracts;
using FluentResults;

namespace FinPlan.Application.Contacts.Queries.GetContactLedger;

public sealed record GetContactLedgerQuery(int ContactId) : IQuery<Result<ContactLedgerResponse>>;

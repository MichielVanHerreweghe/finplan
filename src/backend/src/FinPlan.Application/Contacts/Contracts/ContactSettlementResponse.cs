using FinPlan.Domain.Contacts;

namespace FinPlan.Application.Contacts.Contracts;

public sealed record ContactSettlementResponse(
    int Id, int FromUserId, int ToUserId, decimal Amount, DateOnly Date);

internal static class ContactSettlementMapping
{
    public static ContactSettlementResponse ToResponse(this ContactSettlement settlement) =>
        new(settlement.Id, settlement.FromUserId, settlement.ToUserId, settlement.Amount, settlement.Date);
}

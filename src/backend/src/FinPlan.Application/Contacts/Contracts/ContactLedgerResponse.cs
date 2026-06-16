namespace FinPlan.Application.Contacts.Contracts;

// The full one-on-one ledger with a contact: the other person, the current user's net balance
// against them (positive => they owe you; negative => you owe them), and the combined history.
public sealed record ContactLedgerResponse(
    int ContactId,
    int UserId,
    string? DisplayName,
    string? FirstName,
    string? LastName,
    string? Email,
    decimal Net,
    IReadOnlyList<ContactExpenseResponse> Expenses,
    IReadOnlyList<ContactSettlementResponse> Settlements);

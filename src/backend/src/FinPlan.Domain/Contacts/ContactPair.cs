namespace FinPlan.Domain.Contacts;

// The canonical (order-independent) key for a one-on-one ledger between two users: A is always the
// lower id. Storing the pair canonically means both users resolve to the same ledger regardless of
// who logged the expense or who added whom as a contact.
public readonly record struct ContactPair(int A, int B)
{
    public static ContactPair Of(int x, int y) => x < y ? new ContactPair(x, y) : new ContactPair(y, x);

    public bool IsValid => A > 0 && B > 0 && A != B;

    public bool Contains(int userId) => userId == A || userId == B;
}

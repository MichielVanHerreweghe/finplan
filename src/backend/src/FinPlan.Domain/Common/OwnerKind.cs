namespace FinPlan.Domain.Common;

public enum OwnerKind
{
    Undefined = 0,

    // A single user's private finances.
    Personal = 1,

    // A group of users sharing one set of finances.
    Group = 2
}

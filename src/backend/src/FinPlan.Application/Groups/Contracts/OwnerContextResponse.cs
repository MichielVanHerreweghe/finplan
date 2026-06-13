using FinPlan.Domain.Common;

namespace FinPlan.Application.Groups.Contracts;

// One context a user can act in: their personal finances, or a group they belong to. The
// frontend's context switcher renders these; OwnerId is what it sends back as the active context.
public sealed record OwnerContextResponse(int OwnerId, OwnerKind Kind, string Name);

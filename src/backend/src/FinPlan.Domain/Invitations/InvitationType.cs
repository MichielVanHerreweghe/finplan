namespace FinPlan.Domain.Invitations;

// What an invitation grants once accepted. Contact has no target; the others reference a group or
// activity id via Invitation.TargetId.
public enum InvitationType
{
    Undefined = 0,
    Contact = 1,
    GroupMember = 2,
    ActivityMember = 3,
}

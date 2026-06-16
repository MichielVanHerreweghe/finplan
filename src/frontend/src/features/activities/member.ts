// A activity member as returned by the API (subset of ActivityFields.members). Kept as a local
// shape so the dialogs don't depend on the exact generated fragment field name.
export interface ActivityMember {
  userId: number;
  displayName?: string | null;
  email?: string | null;
  pending?: boolean | null;
}

/** Best available human label for a member: display name, then email, then a fallback. */
export function memberLabel(member: ActivityMember | undefined, userId: number): string {
  return member?.displayName ?? member?.email ?? `User #${userId}`;
}

// Best human label for a contact: their captured first + last name, then the token display name,
// then email, then a fallback. Works for any shape carrying these fields (contact list, ledger).
interface ContactNameParts {
  userId: number;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  email?: string | null;
}

export function contactName(contact: ContactNameParts): string {
  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(" ").trim();
  return fullName || contact.displayName || contact.email || `User #${contact.userId}`;
}

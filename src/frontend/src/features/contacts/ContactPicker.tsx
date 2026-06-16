import type { ContactFieldsFragment } from "@/gql/graphql";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { contactName } from "./contactName";

const contactLabel = (contact: ContactFieldsFragment) => contactName(contact);

interface ContactPickerProps {
  contacts: readonly ContactFieldsFragment[];
  /** Called with the chosen contact's email so the caller can fill its email field. */
  onSelect: (email: string) => void;
}

// Quick-add helper: pick from saved contacts to fill the email field below. Only contacts with a
// resolvable email are offered, since members are added by email.
export function ContactPicker({ contacts, onSelect }: ContactPickerProps) {
  const withEmail = contacts.filter(
    (contact): contact is ContactFieldsFragment & { email: string } => Boolean(contact.email),
  );

  if (withEmail.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label>From contacts</Label>
      <Select onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Pick a contact…" />
        </SelectTrigger>
        <SelectContent>
          {withEmail.map((contact) => (
            <SelectItem key={contact.id} value={contact.email}>
              {contactLabel(contact)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

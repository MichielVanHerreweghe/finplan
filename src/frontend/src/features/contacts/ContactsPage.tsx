import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "urql";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

import { RemoveContactMutation } from "@/graphql/operations";
import type { ContactFieldsFragment } from "@/gql/graphql";
import type { NameSort } from "@/graphql/enums";
import { combinedErrorMessage, payloadErrorMessage } from "@/lib/graphql-error";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { SortSelect } from "@/components/sort-select";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useContacts } from "./useContacts";
import { AddContactDialog } from "./AddContactDialog";
import { contactName } from "./contactName";

const contactLabel = (contact: ContactFieldsFragment) => contactName(contact);

// Smaller than half a cent counts as settled, guarding against decimal noise.
const isSettled = (net: number) => Math.abs(net) < 0.005;

const SORT_OPTIONS: { value: NameSort; label: string }[] = [
  { value: "NAME_ASC", label: "Name (A–Z)" },
  { value: "NAME_DESC", label: "Name (Z–A)" },
];

export function ContactsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<NameSort>("NAME_ASC");
  const variables = useMemo(
    () => ({ search: search || undefined, sort }),
    [search, sort],
  );

  const { contacts, fetching, error, refetch } = useContacts(variables);

  const [, removeContact] = useMutation(RemoveContactMutation);

  const [addOpen, setAddOpen] = useState(false);
  const [confirm, setConfirm] = useState<ContactFieldsFragment | undefined>();
  const [pending, setPending] = useState(false);

  async function onConfirm() {
    if (!confirm) return;
    setPending(true);
    const result = await removeContact({ input: { contactId: confirm.id } });
    setPending(false);
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.removeContact.errors);
    if (msg) return toast.error(msg);
    toast.success("Contact removed");
    setConfirm(undefined);
    refetch();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="People you can quickly add to activities and groups."
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus /> Add contact
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search contacts…"
          className="sm:max-w-xs"
        />
        <SortSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />
      </div>

      {fetching && <p className="py-8 text-center text-muted-foreground">Loading…</p>}
      {error && !fetching && (
        <p className="py-8 text-center text-destructive">{combinedErrorMessage(error)}</p>
      )}
      {!fetching && !error && contacts.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          {search ? "No contacts match your search." : "No contacts yet."}
        </p>
      )}

      {!fetching && !error && contacts.length > 0 && (
        <Card>
          <CardContent className="p-2">
            <ul className="divide-y">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="flex items-center justify-between gap-2 px-1 text-sm"
                >
                  <Link
                    to={`/contacts/${contact.id}`}
                    className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md px-2 py-2.5 hover:bg-accent"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{contactLabel(contact)}</p>
                      {contact.email && contactLabel(contact) !== contact.email && (
                        <p className="truncate text-xs text-muted-foreground">{contact.email}</p>
                      )}
                    </div>
                    {!isSettled(contact.net) && (
                      <span
                        className={cn(
                          "shrink-0 text-xs font-medium tabular-nums",
                          contact.net > 0
                            ? "text-green-600 dark:text-green-500"
                            : "text-destructive",
                        )}
                      >
                        {contact.net > 0
                          ? `owes you ${formatCurrency(contact.net)}`
                          : `you owe ${formatCurrency(-contact.net)}`}
                      </span>
                    )}
                  </Link>
                  <button
                    type="button"
                    className="shrink-0 px-2 text-muted-foreground hover:text-destructive"
                    onClick={() => setConfirm(contact)}
                    aria-label="Remove contact"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <AddContactDialog open={addOpen} onOpenChange={setAddOpen} onSaved={refetch} />

      <ConfirmDialog
        open={confirm !== undefined}
        onOpenChange={(open) => !open && setConfirm(undefined)}
        title="Remove contact?"
        description={
          confirm
            ? `${contactLabel(confirm)} will be removed from your contacts.`
            : ""
        }
        confirmLabel="Remove"
        onConfirm={onConfirm}
        pending={pending}
      />
    </div>
  );
}

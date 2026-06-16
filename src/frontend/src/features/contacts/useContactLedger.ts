import { useCallback } from "react";
import { useQuery } from "urql";

import { ContactLedgerQuery } from "@/graphql/operations";

/** The one-on-one ledger with a contact: the other person, net balance, and full history. */
export function useContactLedger(contactId: number) {
  const paused = Number.isNaN(contactId);

  const [{ data, fetching, error }, reexecute] = useQuery({
    query: ContactLedgerQuery,
    variables: { contactId },
    pause: paused,
  });

  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );

  return { ledger: data?.contactLedger ?? undefined, fetching, error, refetch };
}

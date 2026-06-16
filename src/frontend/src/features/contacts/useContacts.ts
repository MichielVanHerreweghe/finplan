import { useCallback } from "react";
import { useQuery } from "urql";

import { ContactsQuery } from "@/graphql/operations";
import type { NameSort } from "@/graphql/enums";

interface UseContactsVars {
  search?: string;
  sort?: NameSort;
}

/** The current user's contacts, for the contacts page and the member quick-add picker. */
export function useContacts(variables?: UseContactsVars) {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: ContactsQuery,
    variables,
  });

  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );

  return { contacts: data?.contacts ?? [], fetching, error, refetch };
}

import { useCallback } from "react";
import { useQuery } from "urql";

import { GroupsQuery } from "@/graphql/operations";

/** The current user's groups (with members), for the management page. */
export function useGroups() {
  const [{ data, fetching, error }, reexecute] = useQuery({ query: GroupsQuery });

  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );

  return { groups: data?.groups ?? [], fetching, error, refetch };
}

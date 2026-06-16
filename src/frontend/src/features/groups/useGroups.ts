import { useCallback } from "react";
import { useQuery } from "urql";

import { GroupsQuery } from "@/graphql/operations";
import type { NameSort } from "@/graphql/enums";

interface UseGroupsVars {
  search?: string;
  sort?: NameSort;
}

/** The current user's groups (with members), for the management page. */
export function useGroups(variables?: UseGroupsVars) {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: GroupsQuery,
    variables,
  });

  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );

  return { groups: data?.groups ?? [], fetching, error, refetch };
}

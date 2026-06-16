import { useCallback } from "react";
import { useQuery } from "urql";

import { ActivitiesQuery } from "@/graphql/operations";
import type { NameSort } from "@/graphql/enums";

interface UseActivitiesVars {
  search?: string;
  sort?: NameSort;
}

/** The current user's activities (those they are a member of). */
export function useActivities(variables?: UseActivitiesVars) {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: ActivitiesQuery,
    variables,
  });

  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );

  return {
    activities: data?.activities ?? [],
    fetching,
    error,
    refetch,
  };
}

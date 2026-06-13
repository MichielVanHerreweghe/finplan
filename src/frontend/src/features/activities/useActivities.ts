import { useCallback } from "react";
import { useQuery } from "urql";

import { ActivitiesQuery } from "@/graphql/operations";

/** The current user's activities (those they are a member of). */
export function useActivities() {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: ActivitiesQuery,
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

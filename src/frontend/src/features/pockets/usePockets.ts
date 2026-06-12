import { useCallback } from "react";
import { useQuery } from "urql";

import { PocketsQuery } from "@/graphql/operations";

/** Shared pockets list query — reused by the transaction and saving-goal forms. */
export function usePockets() {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: PocketsQuery,
  });

  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );

  return {
    pockets: data?.pockets ?? [],
    fetching,
    error,
    refetch,
  };
}

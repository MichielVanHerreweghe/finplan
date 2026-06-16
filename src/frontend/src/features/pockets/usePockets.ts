import { useCallback } from "react";
import { useQuery } from "urql";

import { PocketsQuery } from "@/graphql/operations";
import type { PocketSort } from "@/graphql/enums";

interface UsePocketsVars {
  search?: string;
  sort?: PocketSort;
}

/** Shared pockets list query — reused by the transaction and saving-goal forms. */
export function usePockets(variables?: UsePocketsVars) {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: PocketsQuery,
    variables,
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

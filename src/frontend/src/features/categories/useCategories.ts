import { useCallback } from "react";
import { useQuery } from "urql";

import { CategoriesQuery } from "@/graphql/operations";

/** Shared categories list query — reused by the transaction form's dropdown. */
export function useCategories() {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: CategoriesQuery,
  });

  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );

  return {
    categories: data?.transactionCategories ?? [],
    fetching,
    error,
    refetch,
  };
}

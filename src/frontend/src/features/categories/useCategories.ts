import { useCallback } from "react";
import { useQuery } from "urql";

import { CategoriesQuery } from "@/graphql/operations";
import type { NameSort } from "@/graphql/enums";

interface UseCategoriesVars {
  search?: string;
  sort?: NameSort;
}

/** Shared categories list query — reused by the transaction form's dropdown. */
export function useCategories(variables?: UseCategoriesVars) {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: CategoriesQuery,
    variables,
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

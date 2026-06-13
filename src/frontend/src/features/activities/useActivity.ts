import { useCallback } from "react";
import { useQuery } from "urql";

import { ActivityExpensesQuery, ActivityQuery } from "@/graphql/operations";

/** A single activity with its members and balances, plus its expense ledger. */
export function useActivity(id: number) {
  const paused = Number.isNaN(id);

  const [{ data: activityData, fetching: activityFetching, error: activityError }, reexecuteActivity] =
    useQuery({ query: ActivityQuery, variables: { id }, pause: paused });

  const [{ data: expenseData, fetching: expenseFetching, error: expenseError }, reexecuteExpenses] =
    useQuery({ query: ActivityExpensesQuery, variables: { activityId: id }, pause: paused });

  const refetch = useCallback(() => {
    reexecuteActivity({ requestPolicy: "network-only" });
    reexecuteExpenses({ requestPolicy: "network-only" });
  }, [reexecuteActivity, reexecuteExpenses]);

  return {
    activity: activityData?.activity ?? undefined,
    expenses: expenseData?.activityExpenses ?? [],
    fetching: activityFetching || expenseFetching,
    error: activityError ?? expenseError,
    refetch,
  };
}

import type { TransactionFieldsFragment } from "@/gql/graphql";

export const ALL = "ALL";
export const UNCATEGORIZED = "none";

export interface DashboardFilters {
  /** "ALL" | "INCOME" | "EXPENSE" */
  type: string;
  /** "ALL" | "none" (uncategorized) | category id as string */
  categoryId: string;
}

export const defaultFilters: DashboardFilters = {
  type: ALL,
  categoryId: ALL,
};

export function isFilterActive(filters: DashboardFilters): boolean {
  return filters.type !== ALL || filters.categoryId !== ALL;
}

export function applyFilters(
  transactions: readonly TransactionFieldsFragment[],
  filters: DashboardFilters,
): TransactionFieldsFragment[] {
  return transactions.filter((tx) => {
    if (filters.type !== ALL && tx.type !== filters.type) return false;

    if (filters.categoryId === UNCATEGORIZED) {
      if (tx.categoryId != null) return false;
    } else if (filters.categoryId !== ALL) {
      if (tx.categoryId !== Number(filters.categoryId)) return false;
    }

    return true;
  });
}

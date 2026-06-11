import type { TransactionFieldsFragment } from "@/gql/graphql";
import type { Bucket } from "./period";

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  net: number;
  count: number;
  /** Income/expense totals per sub-bucket of the period, zero-filled & ordered. */
  periods: PeriodTotals[];
  /** Expense totals per category, largest first. */
  topExpenseCategories: CategoryTotal[];
  /** In-period transactions, newest first. */
  transactions: TransactionFieldsFragment[];
}

export interface PeriodTotals {
  key: string;
  label: string;
  income: number;
  expense: number;
}

export interface CategoryTotal {
  name: string;
  amount: number;
}

const TOP_CATEGORIES = 5;

/** Buckets a `yyyy-MM-dd` date into a sub-bucket key for the granularity. */
function bucketKey(isoDate: string, sub: "day" | "month"): string {
  return sub === "month" ? isoDate.slice(0, 7) : isoDate.slice(0, 10);
}

/**
 * Aggregates the (already period- and filter-scoped) transactions. The chart
 * `periods` align to the supplied `buckets` scaffold so empty sub-periods still
 * render (e.g. a day with no spending shows a zero bar).
 */
export function computeDashboardStats(
  transactions: readonly TransactionFieldsFragment[],
  buckets: Bucket[],
  sub: "day" | "month",
): DashboardStats {
  let totalIncome = 0;
  let totalExpense = 0;
  const bucketMap = new Map<string, { income: number; expense: number }>();
  const categoryMap = new Map<string, number>();

  for (const tx of transactions) {
    const isIncome = tx.type === "INCOME";
    if (isIncome) totalIncome += tx.amount;
    else totalExpense += tx.amount;

    const key = bucketKey(tx.date, sub);
    const entry = bucketMap.get(key) ?? { income: 0, expense: 0 };
    if (isIncome) entry.income += tx.amount;
    else entry.expense += tx.amount;
    bucketMap.set(key, entry);

    if (!isIncome) {
      const name = tx.category?.name ?? "Uncategorized";
      categoryMap.set(name, (categoryMap.get(name) ?? 0) + tx.amount);
    }
  }

  const periods = buckets.map((b) => ({
    key: b.key,
    label: b.label,
    income: bucketMap.get(b.key)?.income ?? 0,
    expense: bucketMap.get(b.key)?.expense ?? 0,
  }));

  const topExpenseCategories = [...categoryMap.entries()]
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, TOP_CATEGORIES);

  const sorted = [...transactions].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id - a.id,
  );

  return {
    totalIncome,
    totalExpense,
    net: totalIncome - totalExpense,
    count: transactions.length,
    periods,
    topExpenseCategories,
    transactions: sorted,
  };
}

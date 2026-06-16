import { useMemo, useState } from "react";
import { useQuery } from "urql";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Wallet,
} from "lucide-react";

import { TransactionsQuery } from "@/graphql/operations";
import type { TransactionFieldsFragment } from "@/gql/graphql";
import { combinedErrorMessage } from "@/lib/graphql-error";
import { formatCurrency, formatDate, todayIso } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import type { TransactionType } from "@/graphql/enums";
import { computeDashboardStats, type PeriodTotals } from "./stats";
import { DashboardFilters } from "./DashboardFilters";
import {
  ALL,
  UNCATEGORIZED,
  defaultFilters,
  type DashboardFilters as Filters,
} from "./filters";
import {
  PERIOD_UNITS,
  periodBuckets,
  periodLabel,
  periodRange,
  shiftPeriod,
  subGranularity,
  type PeriodUnit,
} from "./period";

const TRANSACTIONS_SHOWN = 8;

const CHART_DESCRIPTION: Record<PeriodUnit, string> = {
  day: "Income vs. expenses on this day",
  week: "Income vs. expenses per day",
  month: "Income vs. expenses per day",
  year: "Income vs. expenses per month",
};

export function DashboardPage() {
  const [unit, setUnit] = useState<PeriodUnit>("month");
  const [anchor, setAnchor] = useState<string>(todayIso());
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const range = useMemo(() => periodRange(unit, anchor), [unit, anchor]);
  const buckets = useMemo(() => periodBuckets(unit, anchor), [unit, anchor]);

  // Period scoping + type/category filtering happen server-side via query
  // variables, so the dashboard refetches as the user navigates periods or
  // changes filters rather than slicing a full client-side list.
  const variables = useMemo(
    () => ({
      filter: {
        type: filters.type === ALL ? undefined : (filters.type as TransactionType),
        categoryId:
          filters.categoryId === ALL || filters.categoryId === UNCATEGORIZED
            ? undefined
            : Number(filters.categoryId),
        uncategorized: filters.categoryId === UNCATEGORIZED,
        fromDate: range.start,
        toDate: range.end,
      },
    }),
    [filters, range],
  );

  const [{ data, fetching, error }] = useQuery({
    query: TransactionsQuery,
    variables,
  });

  const transactions = useMemo(() => data?.transactions ?? [], [data]);

  // Transfers are internal pocket-to-pocket moves, not income or spending, so they
  // are excluded from the income/spending overview entirely.
  const scoped = useMemo(
    () => transactions.filter((tx) => tx.type !== "TRANSFER"),
    [transactions],
  );
  const stats = useMemo(
    () => computeDashboardStats(scoped, buckets, subGranularity(unit)),
    [scoped, buckets, unit],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="An overview of your income and spending."
      />

      {fetching && (
        <p className="py-8 text-center text-muted-foreground">Loading…</p>
      )}
      {error && !fetching && (
        <p className="py-8 text-center text-destructive">
          {combinedErrorMessage(error)}
        </p>
      )}

      {!fetching && !error && (
        <>
          <div className="space-y-3 rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <UnitToggle value={unit} onChange={setUnit} />
              <PeriodNav
                label={periodLabel(unit, anchor)}
                onPrev={() => setAnchor((a) => shiftPeriod(unit, a, -1))}
                onNext={() => setAnchor((a) => shiftPeriod(unit, a, 1))}
                onToday={() => setAnchor(todayIso())}
              />
            </div>
            <DashboardFilters filters={filters} onChange={setFilters} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Income"
              value={formatCurrency(stats.totalIncome)}
              icon={<ArrowUpRight className="size-5" />}
              iconClassName="bg-success/15 text-success"
            />
            <StatCard
              label="Expenses"
              value={formatCurrency(stats.totalExpense)}
              icon={<ArrowDownLeft className="size-5" />}
              iconClassName="bg-warning/20 text-warning-foreground dark:text-warning"
            />
            <StatCard
              label="Net balance"
              value={formatCurrency(stats.net)}
              valueClassName={stats.net >= 0 ? "text-success" : "text-destructive"}
              icon={<Wallet className="size-5" />}
              iconClassName="bg-primary/10 text-primary"
            />
            <StatCard
              label="Transactions"
              value={String(stats.count)}
              icon={<Receipt className="size-5" />}
              iconClassName="bg-secondary text-muted-foreground"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <CashFlowChart
              periods={stats.periods}
              description={CHART_DESCRIPTION[unit]}
              empty={stats.count === 0}
            />
            <TopCategories categories={stats.topExpenseCategories} />
            <PeriodTransactions transactions={stats.transactions} />
          </div>
        </>
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClassName?: string;
  valueClassName?: string;
}

function StatCard({ label, value, icon, iconClassName, valueClassName }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 p-5">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={cn("truncate text-2xl font-semibold tabular-nums", valueClassName)}>
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            iconClassName,
          )}
        >
          {icon}
        </span>
      </CardContent>
    </Card>
  );
}

function UnitToggle({
  value,
  onChange,
}: {
  value: PeriodUnit;
  onChange: (unit: PeriodUnit) => void;
}) {
  return (
    <div className="inline-flex rounded-md border p-0.5">
      {PERIOD_UNITS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors",
            value === option.value
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function PeriodNav({
  label,
  onPrev,
  onNext,
  onToday,
}: {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon" onClick={onPrev} aria-label="Previous period">
        <ChevronLeft />
      </Button>
      <span className="min-w-36 text-center text-sm font-medium">{label}</span>
      <Button variant="outline" size="icon" onClick={onNext} aria-label="Next period">
        <ChevronRight />
      </Button>
      <Button variant="ghost" size="sm" onClick={onToday}>
        Today
      </Button>
    </div>
  );
}

function CashFlowChart({
  periods,
  description,
  empty,
}: {
  periods: PeriodTotals[];
  description: string;
  empty: boolean;
}) {
  const max = Math.max(1, ...periods.map((p) => Math.max(p.income, p.expense)));
  // Keep day labels legible when a month produces ~30 bars.
  const showEveryLabel = periods.length <= 16;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash flow</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {empty ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No transactions in this period.
          </p>
        ) : (
          <div className="flex h-44 items-end justify-around gap-1">
            {periods.map((p, i) => (
              <div
                key={p.key}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
              >
                <div className="flex h-full w-full items-end justify-center gap-0.5">
                  <div
                    className="w-1.5 min-w-1.5 flex-1 rounded-t bg-success"
                    style={{ height: `${(p.income / max) * 100}%` }}
                    title={`${p.label} · Income: ${formatCurrency(p.income)}`}
                  />
                  <div
                    className="w-1.5 min-w-1.5 flex-1 rounded-t bg-warning"
                    style={{ height: `${(p.expense / max) * 100}%` }}
                    title={`${p.label} · Expenses: ${formatCurrency(p.expense)}`}
                  />
                </div>
                <span className="h-3 text-[10px] leading-3 text-muted-foreground">
                  {showEveryLabel || i % 5 === 0 ? p.label : ""}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-success" /> Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-warning" /> Expenses
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function TopCategories({
  categories,
}: {
  categories: ReturnType<typeof computeDashboardStats>["topExpenseCategories"];
}) {
  const max = Math.max(1, ...categories.map((c) => c.amount));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top expense categories</CardTitle>
        <CardDescription>Where your money goes</CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expenses in this period.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{c.name}</span>
                  <span className="font-medium">{formatCurrency(c.amount)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-warning"
                    style={{ width: `${(c.amount / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PeriodTransactions({
  transactions,
}: {
  transactions: TransactionFieldsFragment[];
}) {
  const shown = transactions.slice(0, TRANSACTIONS_SHOWN);
  const remaining = transactions.length - shown.length;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Activity in this period</CardDescription>
      </CardHeader>
      <CardContent>
        {shown.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No transactions in this period.
          </p>
        ) : (
          <div className="divide-y">
            {shown.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <Badge variant={tx.type === "INCOME" ? "success" : "warning"}>
                    {tx.type === "INCOME" ? "Income" : "Expense"}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{tx.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(tx.date)}
                      {tx.category ? ` · ${tx.category.name}` : ""}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm font-medium tabular-nums",
                    tx.type === "INCOME" && "text-success",
                  )}
                >
                  {tx.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
            {remaining > 0 && (
              <p className="pt-3 text-center text-xs text-muted-foreground">
                + {remaining} more in this period
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

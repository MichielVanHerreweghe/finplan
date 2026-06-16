import { useCallback, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "urql";
import { ArrowLeft, Pencil } from "lucide-react";

import {
  SavingGoalsQuery,
  TransactionsByPocketQuery,
} from "@/graphql/operations";
import type { TransactionFieldsFragment } from "@/gql/graphql";
import type { TransactionSort } from "@/graphql/enums";
import { combinedErrorMessage } from "@/lib/graphql-error";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/search-input";
import { SortSelect } from "@/components/sort-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePockets } from "./usePockets";
import { PocketFormDialog } from "./PocketFormDialog";
import { PocketTransactionActions } from "./PocketTransactionActions";

function typeLabel(type: string) {
  return type === "INCOME" ? "Income" : type === "EXPENSE" ? "Expense" : "Transfer";
}

function typeBadgeVariant(type: string) {
  return type === "INCOME" ? "success" : type === "EXPENSE" ? "warning" : "secondary";
}

const SORT_OPTIONS: { value: TransactionSort; label: string }[] = [
  { value: "DATE_DESC", label: "Newest first" },
  { value: "DATE_ASC", label: "Oldest first" },
  { value: "AMOUNT_DESC", label: "Amount (high–low)" },
  { value: "AMOUNT_ASC", label: "Amount (low–high)" },
];

export function PocketDetailPage() {
  const { id } = useParams();
  const pocketId = Number(id);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<TransactionSort>("DATE_DESC");

  const { pockets, refetch: refetchPockets } = usePockets();
  const txVariables = useMemo(
    () => ({ pocketId, search: search || undefined, sort }),
    [pocketId, search, sort],
  );
  const [{ data: txData, fetching, error }, reexecuteTx] = useQuery({
    query: TransactionsByPocketQuery,
    variables: txVariables,
    pause: Number.isNaN(pocketId),
  });
  const [{ data: goalData }, reexecuteGoals] = useQuery({
    query: SavingGoalsQuery,
  });

  const refetch = useCallback(() => {
    refetchPockets();
    reexecuteTx({ requestPolicy: "network-only" });
    reexecuteGoals({ requestPolicy: "network-only" });
  }, [refetchPockets, reexecuteTx, reexecuteGoals]);

  const [editOpen, setEditOpen] = useState(false);

  const pocket = pockets.find((p) => p.id === pocketId);
  const children = pockets.filter((p) => p.parentPocketId === pocketId);
  const parent = pocket?.parentPocketId
    ? pockets.find((p) => p.id === pocket.parentPocketId)
    : undefined;
  const linkedGoals = (goalData?.savingGoals ?? []).filter(
    (goal) => goal.pocketId === pocketId,
  );
  const transactions = txData?.transactionsByPocket ?? [];
  const pocketName = (pid: number) =>
    pockets.find((p) => p.id === pid)?.name ?? "?";

  const stateMessage = fetching
    ? "Loading…"
    : error
      ? combinedErrorMessage(error)
      : transactions.length === 0
        ? search
          ? "No transactions match your search."
          : "No transactions for this pocket yet."
        : null;

  function movement(tx: TransactionFieldsFragment) {
    const from = tx.fromPocketId != null ? pocketName(tx.fromPocketId) : null;
    const to = tx.toPocketId != null ? pocketName(tx.toPocketId) : null;
    if (tx.type === "TRANSFER") return `${from} → ${to}`;
    if (tx.type === "INCOME") return `→ ${to ?? "—"}`;
    return `${from ?? "—"} →`;
  }

  if (Number.isNaN(pocketId) || (!pocket && pockets.length > 0)) {
    return (
      <div className="space-y-4">
        <Link
          to="/pockets"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Pockets
        </Link>
        <p className="py-8 text-center text-muted-foreground">
          Pocket not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/pockets"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Pockets
      </Link>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {pocket?.name ?? "…"}
              </h1>
              {pocket?.description && (
                <p className="text-sm text-muted-foreground">
                  {pocket.description}
                </p>
              )}
              {parent && (
                <p className="text-xs text-muted-foreground">
                  Nested in{" "}
                  <Link
                    to={`/pockets/${parent.id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {parent.name}
                  </Link>
                </p>
              )}
            </div>
            <div className="sm:text-right">
              <div className="text-3xl font-semibold tabular-nums">
                {formatCurrency(pocket?.balance ?? 0)}
              </div>
              {pocket && pocket.startingAmount > 0 && (
                <div className="text-xs text-muted-foreground">
                  incl. {formatCurrency(pocket.startingAmount)} starting
                </div>
              )}
            </div>
          </div>

          {pocket && (
            <div className="flex flex-wrap gap-2">
              <PocketTransactionActions pocketId={pocket.id} onSaved={refetch} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                <Pencil /> Edit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {children.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Sub-pockets
          </h2>
          <div className="divide-y rounded-xl border bg-card">
            {children.map((child) => (
              <Link
                key={child.id}
                to={`/pockets/${child.id}`}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-secondary/60"
              >
                <span className="font-medium">{child.name}</span>
                <span className="tabular-nums">
                  {formatCurrency(child.balance)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {linkedGoals.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Saving goals tracking this pocket
          </h2>
          <div className="divide-y rounded-xl border bg-card">
            {linkedGoals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="font-medium">{goal.name}</span>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {formatCurrency(goal.savedAmount)} of{" "}
                  {formatCurrency(goal.targetAmount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            Transactions
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search…"
              className="sm:w-48"
            />
            <SortSelect
              value={sort}
              onChange={setSort}
              options={SORT_OPTIONS}
              className="w-full sm:w-44"
            />
          </div>
        </div>

        {stateMessage ? (
          <p
            className={cn(
              "rounded-xl border bg-card py-8 text-center text-sm",
              error ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {stateMessage}
          </p>
        ) : (
          <>
            {/* Desktop: table */}
            <div className="hidden rounded-xl border bg-card md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Movement</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => {
                    const incoming = tx.toPocketId === pocketId;
                    return (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.name}</TableCell>
                        <TableCell>{formatDate(tx.date)}</TableCell>
                        <TableCell>
                          <Badge variant={typeBadgeVariant(tx.type)}>
                            {typeLabel(tx.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {movement(tx)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-medium tabular-nums",
                            incoming && "text-success",
                          )}
                        >
                          {incoming ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile: card list */}
            <div className="space-y-3 md:hidden">
              {transactions.map((tx) => {
                const incoming = tx.toPocketId === pocketId;
                return (
                  <div key={tx.id} className="rounded-xl border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="truncate font-medium">{tx.name}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={typeBadgeVariant(tx.type)}>
                            {typeLabel(tx.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(tx.date)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {movement(tx)}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 font-semibold tabular-nums",
                          incoming && "text-success",
                        )}
                      >
                        {incoming ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {pocket && (
        <PocketFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          pocket={pocket}
          pockets={pockets}
          onSaved={refetch}
        />
      )}
    </div>
  );
}

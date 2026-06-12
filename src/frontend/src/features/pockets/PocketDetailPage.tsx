import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "urql";
import { ArrowLeft, Pencil } from "lucide-react";

import {
  SavingGoalsQuery,
  TransactionsByPocketQuery,
} from "@/graphql/operations";
import type { TransactionFieldsFragment } from "@/gql/graphql";
import { combinedErrorMessage } from "@/lib/graphql-error";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

export function PocketDetailPage() {
  const { id } = useParams();
  const pocketId = Number(id);

  const { pockets, refetch: refetchPockets } = usePockets();
  const [{ data: txData, fetching, error }, reexecuteTx] = useQuery({
    query: TransactionsByPocketQuery,
    variables: { pocketId },
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
          <div className="flex items-start justify-between gap-4">
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
            <div className="text-right">
              <div className="text-2xl font-semibold tabular-nums">
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
          <div className="rounded-lg border divide-y">
            {children.map((child) => (
              <Link
                key={child.id}
                to={`/pockets/${child.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-secondary/40"
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
          <div className="rounded-lg border divide-y">
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

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          Transactions
        </h2>
        <div className="rounded-lg border">
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
              {fetching && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {error && !fetching && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-destructive">
                    {combinedErrorMessage(error)}
                  </TableCell>
                </TableRow>
              )}
              {!fetching && !error && transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No transactions for this pocket yet.
                  </TableCell>
                </TableRow>
              )}
              {transactions.map((tx) => {
                const incoming = tx.toPocketId === pocketId;
                return (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.name}</TableCell>
                    <TableCell>{formatDate(tx.date)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.type === "INCOME"
                            ? "success"
                            : tx.type === "EXPENSE"
                              ? "warning"
                              : "secondary"
                        }
                      >
                        {tx.type === "INCOME"
                          ? "Income"
                          : tx.type === "EXPENSE"
                            ? "Expense"
                            : "Transfer"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {movement(tx)}
                    </TableCell>
                    <TableCell
                      className={
                        incoming
                          ? "text-right font-medium text-emerald-600"
                          : "text-right font-medium"
                      }
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

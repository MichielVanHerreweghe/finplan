import { useCallback, useState } from "react";
import { useMutation, useQuery } from "urql";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  DeleteTransactionMutation,
  TransactionsQuery,
} from "@/graphql/operations";
import type { TransactionFieldsFragment } from "@/gql/graphql";
import { payloadErrorMessage, combinedErrorMessage } from "@/lib/graphql-error";
import { formatCurrency, formatDate } from "@/lib/format";
import { usePockets } from "@/features/pockets/usePockets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TransactionFormDialog } from "./TransactionFormDialog";

const COLUMN_COUNT = 7;

export function TransactionsPage() {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: TransactionsQuery,
  });
  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );
  const { pockets } = usePockets();
  const [, deleteTransaction] = useMutation(DeleteTransactionMutation);

  const transactions = data?.transactions ?? [];
  const pocketName = (id: number) =>
    pockets.find((pocket) => pocket.id === id)?.name ?? "?";

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TransactionFieldsFragment | undefined>();
  const [deleting, setDeleting] = useState<TransactionFieldsFragment | undefined>();
  const [deletePending, setDeletePending] = useState(false);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(transaction: TransactionFieldsFragment) {
    setEditing(transaction);
    setFormOpen(true);
  }

  function movement(tx: TransactionFieldsFragment) {
    const from = tx.fromPocketId != null ? pocketName(tx.fromPocketId) : null;
    const to = tx.toPocketId != null ? pocketName(tx.toPocketId) : null;
    if (tx.type === "TRANSFER") return `${from} → ${to}`;
    if (tx.type === "INCOME") return `→ ${to ?? "—"}`;
    return `${from ?? "—"} →`;
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletePending(true);
    const result = await deleteTransaction({ input: { id: deleting.id } });
    setDeletePending(false);
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.deleteTransaction.errors);
    if (msg) return toast.error(msg);
    toast.success("Transaction deleted");
    setDeleting(undefined);
    refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            Track income, expenses, and transfers between pockets.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> New transaction
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Pocket</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetching && (
              <TableRow>
                <TableCell colSpan={COLUMN_COUNT} className="py-8 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {error && !fetching && (
              <TableRow>
                <TableCell colSpan={COLUMN_COUNT} className="py-8 text-center text-destructive">
                  {combinedErrorMessage(error)}
                </TableCell>
              </TableRow>
            )}
            {!fetching && !error && transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLUMN_COUNT} className="py-8 text-center text-muted-foreground">
                  No transactions yet.
                </TableCell>
              </TableRow>
            )}
            {transactions.map((tx) => (
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
                <TableCell className="text-muted-foreground">
                  {tx.category?.name ?? "—"}
                </TableCell>
                <TableCell
                  className={
                    tx.type === "INCOME"
                      ? "text-right font-medium text-emerald-600"
                      : "text-right font-medium"
                  }
                >
                  {tx.type === "INCOME" ? "+" : tx.type === "EXPENSE" ? "-" : ""}
                  {formatCurrency(tx.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(tx)}
                      aria-label="Edit transaction"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleting(tx)}
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={editing}
        onSaved={refetch}
      />

      <ConfirmDialog
        open={deleting !== undefined}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Delete transaction?"
        description={`"${deleting?.name}" will be permanently removed.`}
        onConfirm={confirmDelete}
        pending={deletePending}
      />
    </div>
  );
}

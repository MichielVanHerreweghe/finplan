import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "urql";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  DeleteTransactionMutation,
  TransactionsQuery,
} from "@/graphql/operations";
import type { TransactionFieldsFragment } from "@/gql/graphql";
import type { TransactionSort, TransactionType } from "@/graphql/enums";
import { payloadErrorMessage, combinedErrorMessage } from "@/lib/graphql-error";
import { formatCurrency, formatDate } from "@/lib/format";
import { usePockets } from "@/features/pockets/usePockets";
import { useCategories } from "@/features/categories/useCategories";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { SortSelect } from "@/components/sort-select";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TransactionFormDialog } from "./TransactionFormDialog";

const COLUMN_COUNT = 7;
const ALL = "ALL";
const UNCATEGORIZED = "UNCATEGORIZED";

const SORT_OPTIONS: { value: TransactionSort; label: string }[] = [
  { value: "DATE_DESC", label: "Newest first" },
  { value: "DATE_ASC", label: "Oldest first" },
  { value: "AMOUNT_DESC", label: "Amount (high–low)" },
  { value: "AMOUNT_ASC", label: "Amount (low–high)" },
  { value: "NAME_ASC", label: "Name (A–Z)" },
  { value: "NAME_DESC", label: "Name (Z–A)" },
];

function typeLabel(type: string) {
  return type === "INCOME" ? "Income" : type === "EXPENSE" ? "Expense" : "Transfer";
}

function typeBadgeVariant(type: string) {
  return type === "INCOME" ? "success" : type === "EXPENSE" ? "warning" : "secondary";
}

function amountSign(type: string) {
  return type === "INCOME" ? "+" : type === "EXPENSE" ? "-" : "";
}

export function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>(ALL);
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL);
  const [sort, setSort] = useState<TransactionSort>("DATE_DESC");

  const variables = useMemo(
    () => ({
      filter: {
        search: search || undefined,
        type: typeFilter === ALL ? undefined : (typeFilter as TransactionType),
        categoryId:
          categoryFilter === ALL || categoryFilter === UNCATEGORIZED
            ? undefined
            : Number(categoryFilter),
        uncategorized: categoryFilter === UNCATEGORIZED,
      },
      sort,
    }),
    [search, typeFilter, categoryFilter, sort],
  );

  const [{ data, fetching, error }, reexecute] = useQuery({
    query: TransactionsQuery,
    variables,
  });
  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );
  const { pockets } = usePockets();
  const { categories } = useCategories();
  const [, deleteTransaction] = useMutation(DeleteTransactionMutation);

  const transactions = data?.transactions ?? [];
  const pocketName = (id: number) =>
    pockets.find((pocket) => pocket.id === id)?.name ?? "?";

  const isFiltered =
    search !== "" || typeFilter !== ALL || categoryFilter !== ALL;

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

  const stateMessage = fetching
    ? "Loading…"
    : error
      ? combinedErrorMessage(error)
      : transactions.length === 0
        ? isFiltered
          ? "No transactions match your filters."
          : "No transactions yet."
        : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Track income, expenses, and transfers between pockets."
        action={
          <Button onClick={openCreate}>
            <Plus /> New transaction
          </Button>
        }
      />

      <div className="space-y-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search transactions…"
        />
        <div className="flex flex-wrap gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40" aria-label="Filter by type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All types</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="TRANSFER">Transfer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              <SelectItem value={UNCATEGORIZED}>Uncategorized</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <SortSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />
        </div>
      </div>

      {/* Desktop: table */}
      <div className="hidden rounded-xl border bg-card md:block">
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
            {stateMessage && (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className={cn(
                    "py-8 text-center",
                    error ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {stateMessage}
                </TableCell>
              </TableRow>
            )}
            {transactions.map((tx) => (
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
                <TableCell className="text-muted-foreground">
                  {tx.category?.name ?? "—"}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium tabular-nums",
                    tx.type === "INCOME" && "text-success",
                  )}
                >
                  {amountSign(tx.type)}
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

      {/* Mobile: card list */}
      <div className="space-y-3 md:hidden">
        {stateMessage && (
          <p
            className={cn(
              "py-8 text-center text-sm",
              error ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {stateMessage}
          </p>
        )}
        {transactions.map((tx) => (
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
                  {tx.category ? ` · ${tx.category.name}` : ""}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    tx.type === "INCOME" && "text-success",
                  )}
                >
                  {amountSign(tx.type)}
                  {formatCurrency(tx.amount)}
                </span>
                <div className="-mr-2 flex gap-1">
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
              </div>
            </div>
          </div>
        ))}
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

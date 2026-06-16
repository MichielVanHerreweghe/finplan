import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "urql";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import {
  DeleteContactExpenseMutation,
  DeleteContactSettlementMutation,
  MeQuery,
} from "@/graphql/operations";
import { combinedErrorMessage, payloadErrorMessage } from "@/lib/graphql-error";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { cn } from "@/lib/utils";
import { useContactLedger } from "./useContactLedger";
import { ContactExpenseFormDialog } from "./ContactExpenseFormDialog";
import { SettleUpDialog } from "./SettleUpDialog";
import { contactName } from "./contactName";

// Smaller than half a cent counts as settled, guarding against decimal noise.
const isSettled = (net: number) => Math.abs(net) < 0.005;

type ConfirmAction =
  | { kind: "expense"; id: number; label: string }
  | { kind: "settlement"; id: number; label: string };

export function ContactDetailPage() {
  const params = useParams();
  const contactId = Number(params.id);

  const [{ data: meData }] = useQuery({ query: MeQuery });
  const meId = meData?.me?.id;

  const { ledger, fetching, error, refetch } = useContactLedger(contactId);

  const [, deleteExpense] = useMutation(DeleteContactExpenseMutation);
  const [, deleteSettlement] = useMutation(DeleteContactSettlementMutation);

  const [expenseOpen, setExpenseOpen] = useState(false);
  const [settleOpen, setSettleOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmAction | undefined>();
  const [pending, setPending] = useState(false);

  const otherLabel = ledger ? contactName(ledger) : "";
  const nameOf = (userId: number) => (userId === meId ? "You" : otherLabel);

  // Merge expenses + settlements into one history, newest first.
  const history = useMemo(() => {
    if (!ledger) return [];
    const expenses = ledger.expenses.map((expense) => ({ type: "expense" as const, item: expense }));
    const settlements = ledger.settlements.map((s) => ({ type: "settlement" as const, item: s }));
    return [...expenses, ...settlements].sort((a, b) => b.item.date.localeCompare(a.item.date));
  }, [ledger]);

  async function onConfirm() {
    if (!confirm) return;
    setPending(true);
    let errorMessage: string | null = null;
    if (confirm.kind === "expense") {
      const result = await deleteExpense({ input: { id: confirm.id } });
      errorMessage = result.error?.message ?? payloadErrorMessage(result.data?.deleteContactExpense.errors);
    } else {
      const result = await deleteSettlement({ input: { id: confirm.id } });
      errorMessage = result.error?.message ?? payloadErrorMessage(result.data?.deleteContactSettlement.errors);
    }
    setPending(false);
    if (errorMessage) return toast.error(errorMessage);
    toast.success(confirm.kind === "expense" ? "Expense deleted" : "Payment deleted");
    setConfirm(undefined);
    refetch();
  }

  return (
    <div className="space-y-6">
      <Link
        to="/contacts"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Contacts
      </Link>

      {fetching && <p className="py-8 text-center text-muted-foreground">Loading…</p>}
      {error && !fetching && (
        <p className="py-8 text-center text-destructive">{combinedErrorMessage(error)}</p>
      )}

      {!fetching && !error && ledger && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">{otherLabel}</h1>
              {ledger.email && otherLabel !== ledger.email && (
                <p className="text-sm text-muted-foreground">{ledger.email}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button variant="outline" onClick={() => setSettleOpen(true)} disabled={isSettled(ledger.net)}>
                Settle up
              </Button>
              <Button onClick={() => setExpenseOpen(true)}>
                <Plus /> Add expense
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-5">
              <p
                className={cn(
                  "text-lg font-semibold",
                  isSettled(ledger.net)
                    ? "text-muted-foreground"
                    : ledger.net > 0
                      ? "text-green-600 dark:text-green-500"
                      : "text-destructive",
                )}
              >
                {isSettled(ledger.net)
                  ? "You're all settled up"
                  : ledger.net > 0
                    ? `${otherLabel} owes you ${formatCurrency(ledger.net)}`
                    : `You owe ${otherLabel} ${formatCurrency(-ledger.net)}`}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">History</h2>
            {history.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No expenses yet. Add one to start tracking what you owe each other.
              </p>
            ) : (
              <Card>
                <CardContent className="p-2">
                  <ul className="divide-y">
                    {history.map((entry) =>
                      entry.type === "expense" ? (
                        <li key={`e-${entry.item.id}`} className="space-y-1 px-3 py-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="min-w-0 truncate font-medium">{entry.item.description}</span>
                            <span className="flex items-center gap-2">
                              <span className="tabular-nums">{formatCurrency(entry.item.amount)}</span>
                              <button
                                type="button"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  setConfirm({ kind: "expense", id: entry.item.id, label: entry.item.description })
                                }
                                aria-label="Delete expense"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(entry.item.date)} · paid by {nameOf(entry.item.paidByUserId)} ·{" "}
                            {entry.item.splits
                              .map((split) => `${nameOf(split.userId)} ${formatCurrency(split.amount)}`)
                              .join(", ")}
                          </p>
                        </li>
                      ) : (
                        <li key={`s-${entry.item.id}`} className="space-y-1 px-3 py-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="min-w-0 truncate text-sm">
                              {nameOf(entry.item.fromUserId)} paid {nameOf(entry.item.toUserId)}
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="tabular-nums text-muted-foreground">
                                {formatCurrency(entry.item.amount)}
                              </span>
                              <button
                                type="button"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  setConfirm({ kind: "settlement", id: entry.item.id, label: "payment" })
                                }
                                aria-label="Delete payment"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{formatDate(entry.item.date)} · payment</p>
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {meId !== undefined && (
            <>
              <ContactExpenseFormDialog
                open={expenseOpen}
                onOpenChange={setExpenseOpen}
                contactId={contactId}
                meId={meId}
                otherUserId={ledger.userId}
                otherLabel={otherLabel}
                onSaved={refetch}
              />
              <SettleUpDialog
                open={settleOpen}
                onOpenChange={setSettleOpen}
                contactId={contactId}
                meId={meId}
                otherUserId={ledger.userId}
                otherLabel={otherLabel}
                net={ledger.net}
                onSaved={refetch}
              />
            </>
          )}

          <ConfirmDialog
            open={confirm !== undefined}
            onOpenChange={(open) => !open && setConfirm(undefined)}
            title={confirm?.kind === "expense" ? "Delete expense?" : "Delete payment?"}
            description={
              confirm?.kind === "expense"
                ? `"${confirm.label}" will be removed and the balance recalculated.`
                : "This payment will be removed and the balance recalculated."
            }
            onConfirm={onConfirm}
            pending={pending}
          />
        </>
      )}
    </div>
  );
}

import { useCallback, useMemo, useState } from "react";
import { useClient, useMutation, useQuery } from "urql";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  DeleteSavingGoalMutation,
  SavingGoalsQuery,
  TransactionsBySavingGoalQuery,
} from "@/graphql/operations";
import type { SavingGoalFieldsFragment } from "@/gql/graphql";
import type { SavingGoalSort, SavingGoalStatus } from "@/graphql/enums";
import { payloadErrorMessage, combinedErrorMessage } from "@/lib/graphql-error";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/format";
import { usePockets } from "@/features/pockets/usePockets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { SortSelect } from "@/components/sort-select";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  TransactionFormDialog,
  type TransactionPreset,
} from "@/features/transactions/TransactionFormDialog";
import { SavingGoalFormDialog } from "./SavingGoalFormDialog";

const SORT_OPTIONS: { value: SavingGoalSort; label: string }[] = [
  { value: "NAME_ASC", label: "Name (A–Z)" },
  { value: "DEADLINE_ASC", label: "Deadline (soonest)" },
  { value: "PROGRESS_DESC", label: "Progress (most)" },
  { value: "TARGET_DESC", label: "Target (largest)" },
  { value: "REMAINING_ASC", label: "Remaining (least)" },
];

const TABS: { key: SavingGoalStatus; label: string }[] = [
  { key: "ACTIVE", label: "Active" },
  { key: "COMPLETED", label: "Completed" },
];

export function SavingGoalsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SavingGoalStatus>("ACTIVE");
  const [sort, setSort] = useState<SavingGoalSort>("NAME_ASC");
  const variables = useMemo(
    () => ({ search: search || undefined, status, sort }),
    [search, status, sort],
  );

  const [{ data, fetching, error }, reexecute] = useQuery({
    query: SavingGoalsQuery,
    variables,
  });
  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );
  const { pockets } = usePockets();
  const client = useClient();
  const [, deleteSavingGoal] = useMutation(DeleteSavingGoalMutation);

  const savingGoals = data?.savingGoals ?? [];
  const pocketName = (id: number) =>
    pockets.find((pocket) => pocket.id === id)?.name;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SavingGoalFieldsFragment | undefined>();
  const [deleting, setDeleting] = useState<SavingGoalFieldsFragment | undefined>();
  const [deletePending, setDeletePending] = useState(false);
  const [fundingPreset, setFundingPreset] = useState<TransactionPreset | undefined>();

  // Fund a goal = a transfer into its linked pocket, tagged to this goal so siblings
  // sharing the pocket stay independent. Auto-named "[Goal] - [n+1]" where n is how
  // many transactions are already tagged to this goal.
  async function openFunding(goal: SavingGoalFieldsFragment) {
    const result = await client
      .query(TransactionsBySavingGoalQuery, { savingGoalId: goal.id })
      .toPromise();
    const count = result.data?.transactionsBySavingGoal.length ?? 0;

    // Offer the goal's required pace (when it has a deadline) as one-tap amounts.
    const quickAmounts: { label: string; value: number }[] = [];
    if (goal.requiredMonthly != null)
      quickAmounts.push({
        label: `Monthly ${formatCurrency(goal.requiredMonthly)}`,
        value: goal.requiredMonthly,
      });
    if (goal.requiredWeekly != null)
      quickAmounts.push({
        label: `Weekly ${formatCurrency(goal.requiredWeekly)}`,
        value: goal.requiredWeekly,
      });

    setFundingPreset({
      type: "TRANSFER",
      toPocketId: goal.pocketId,
      savingGoalId: goal.id,
      name: `${goal.name} - ${count + 1}`,
      quickAmounts: quickAmounts.length ? quickAmounts : undefined,
    });
  }

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(goal: SavingGoalFieldsFragment) {
    setEditing(goal);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletePending(true);
    const result = await deleteSavingGoal({ input: { id: deleting.id } });
    setDeletePending(false);
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.deleteSavingGoal.errors);
    if (msg) return toast.error(msg);
    toast.success("Saving goal deleted");
    setDeleting(undefined);
    refetch();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saving Goals"
        description="Set a target on a pocket and track progress towards it."
        action={
          <Button onClick={openCreate}>
            <Plus /> New saving goal
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="inline-flex gap-1 rounded-lg border bg-secondary/50 p-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatus(key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                status === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search goals…"
            className="sm:w-52"
          />
          <SortSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />
        </div>
      </div>

      {fetching && (
        <p className="py-8 text-center text-muted-foreground">Loading…</p>
      )}
      {error && !fetching && (
        <p className="py-8 text-center text-destructive">
          {combinedErrorMessage(error)}
        </p>
      )}
      {!fetching && !error && savingGoals.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          {search
            ? "No saving goals match your search."
            : status === "COMPLETED"
              ? "No completed saving goals yet."
              : "No active saving goals."}
        </p>
      )}

      <div className="space-y-4">
        {savingGoals.map((goal) => {
          const progress =
            goal.targetAmount > 0
              ? Math.min(100, (goal.savedAmount / goal.targetAmount) * 100)
              : 0;
          const linkedPocket = pocketName(goal.pocketId);

          return (
            <Card key={goal.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{goal.name}</h2>
                      {goal.isCompleted && (
                        <Badge variant="success">Completed</Badge>
                      )}
                      {goal.isOverdue && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground">
                        {goal.description}
                      </p>
                    )}
                    {linkedPocket && (
                      <p className="text-xs text-muted-foreground">
                        Funded by{" "}
                        <span className="font-medium text-foreground">
                          {linkedPocket}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {!goal.isCompleted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openFunding(goal)}
                      >
                        Add funds
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(goal)}
                      aria-label="Edit saving goal"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleting(goal)}
                      aria-label="Delete saving goal"
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-success transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {formatCurrency(goal.savedAmount)} of{" "}
                      {formatCurrency(goal.targetAmount)}
                    </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(goal.remainingAmount)} to go
                    </span>
                  </div>
                </div>

                {goal.deadline && !goal.isCompleted && (
                  <p
                    className={
                      goal.isOverdue
                        ? "text-sm text-destructive"
                        : "text-sm text-muted-foreground"
                    }
                  >
                    {goal.isOverdue ? (
                      <>
                        Deadline {formatDate(goal.deadline)} has passed —{" "}
                        {formatCurrency(goal.remainingAmount)} still needed.
                      </>
                    ) : (
                      <>
                        Save{" "}
                        <span className="font-medium text-foreground">
                          {formatCurrency(goal.requiredMonthly ?? 0)}/month
                        </span>{" "}
                        or{" "}
                        <span className="font-medium text-foreground">
                          {formatCurrency(goal.requiredWeekly ?? 0)}/week
                        </span>{" "}
                        to reach your goal by {formatDate(goal.deadline)}.
                      </>
                    )}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <SavingGoalFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        savingGoal={editing}
        onSaved={refetch}
      />

      <TransactionFormDialog
        open={fundingPreset !== undefined}
        onOpenChange={(open) => !open && setFundingPreset(undefined)}
        preset={fundingPreset}
        onSaved={() => {
          setFundingPreset(undefined);
          refetch();
        }}
      />

      <ConfirmDialog
        open={deleting !== undefined}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Delete saving goal?"
        description={`"${deleting?.name}" will be permanently removed. The linked pocket and its money are kept.`}
        onConfirm={confirmDelete}
        pending={deletePending}
      />
    </div>
  );
}

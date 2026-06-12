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
import { payloadErrorMessage, combinedErrorMessage } from "@/lib/graphql-error";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/format";
import { usePockets } from "@/features/pockets/usePockets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  TransactionFormDialog,
  type TransactionPreset,
} from "@/features/transactions/TransactionFormDialog";
import { SavingGoalFormDialog } from "./SavingGoalFormDialog";

type SortKey = "name" | "deadline" | "progress" | "target" | "remaining";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "name", label: "Name (A–Z)" },
  { value: "deadline", label: "Deadline (soonest)" },
  { value: "progress", label: "Progress (most)" },
  { value: "target", label: "Target (largest)" },
  { value: "remaining", label: "Remaining (least)" },
];

const fractionDone = (goal: SavingGoalFieldsFragment) =>
  goal.targetAmount > 0 ? goal.savedAmount / goal.targetAmount : 0;

function sortGoals(
  goals: readonly SavingGoalFieldsFragment[],
  key: SortKey,
): SavingGoalFieldsFragment[] {
  const sorted = [...goals];
  switch (key) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "deadline":
      // Soonest first; goals without a deadline sink to the bottom (ISO dates compare lexically).
      return sorted.sort((a, b) => {
        if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
        if (a.deadline) return -1;
        if (b.deadline) return 1;
        return a.name.localeCompare(b.name);
      });
    case "progress":
      return sorted.sort((a, b) => fractionDone(b) - fractionDone(a));
    case "target":
      return sorted.sort((a, b) => b.targetAmount - a.targetAmount);
    case "remaining":
      return sorted.sort((a, b) => a.remainingAmount - b.remainingAmount);
  }
}

export function SavingGoalsPage() {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: SavingGoalsQuery,
  });
  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );
  const { pockets } = usePockets();
  const client = useClient();
  const [, deleteSavingGoal] = useMutation(DeleteSavingGoalMutation);

  const savingGoals = data?.savingGoals ?? [];
  const activeGoals = savingGoals.filter((goal) => !goal.isCompleted);
  const completedGoals = savingGoals.filter((goal) => goal.isCompleted);
  const pocketName = (id: number) =>
    pockets.find((pocket) => pocket.id === id)?.name;

  const [tab, setTab] = useState<"active" | "completed">("active");
  const [sort, setSort] = useState<SortKey>("name");
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

  const visibleGoals = tab === "active" ? activeGoals : completedGoals;
  const sortedGoals = useMemo(
    () => sortGoals(visibleGoals, sort),
    [visibleGoals, sort],
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Saving Goals</h1>
          <p className="text-sm text-muted-foreground">
            Set a target on a pocket and track progress towards it.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> New saving goal
        </Button>
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
          No saving goals yet.
        </p>
      )}

      {!fetching && !error && savingGoals.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex gap-1 rounded-lg border bg-secondary/50 p-1">
              {(
                [
                  { key: "active", label: "Active", count: activeGoals.length },
                  {
                    key: "completed",
                    label: "Completed",
                    count: completedGoals.length,
                  },
                ] as const
              ).map(({ key, label, count }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    tab === key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by</span>
              <Select
                value={sort}
                onValueChange={(value) => setSort(value as SortKey)}
              >
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {visibleGoals.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              {tab === "active"
                ? "No active saving goals."
                : "No completed saving goals yet."}
            </p>
          )}
        </>
      )}

      <div className="space-y-4">
        {sortedGoals.map((goal) => {
          const progress =
            goal.targetAmount > 0
              ? Math.min(100, (goal.savedAmount / goal.targetAmount) * 100)
              : 0;
          const linkedPocket = pocketName(goal.pocketId);

          return (
            <Card key={goal.id}>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
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
                      className="h-full rounded-full bg-emerald-500 transition-all"
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

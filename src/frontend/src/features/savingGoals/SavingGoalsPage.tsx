import { useCallback, useState } from "react";
import { useMutation, useQuery } from "urql";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";

import {
  DeleteSavingGoalMutation,
  RemoveContributionMutation,
  SavingGoalsQuery,
} from "@/graphql/operations";
import type { SavingGoalFieldsFragment } from "@/gql/graphql";
import { payloadErrorMessage, combinedErrorMessage } from "@/lib/graphql-error";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { SavingGoalFormDialog } from "./SavingGoalFormDialog";
import { ContributionDialog } from "./ContributionDialog";

export function SavingGoalsPage() {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: SavingGoalsQuery,
  });
  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );
  const [, deleteSavingGoal] = useMutation(DeleteSavingGoalMutation);
  const [, removeContribution] = useMutation(RemoveContributionMutation);

  const savingGoals = data?.savingGoals ?? [];
  const activeGoals = savingGoals.filter((goal) => !goal.isCompleted);
  const completedGoals = savingGoals.filter((goal) => goal.isCompleted);

  const [tab, setTab] = useState<"active" | "completed">("active");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SavingGoalFieldsFragment | undefined>();
  const [funding, setFunding] = useState<SavingGoalFieldsFragment | undefined>();
  const [deleting, setDeleting] = useState<SavingGoalFieldsFragment | undefined>();
  const [deletePending, setDeletePending] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const visibleGoals = tab === "active" ? activeGoals : completedGoals;

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(goal: SavingGoalFieldsFragment) {
    setEditing(goal);
    setFormOpen(true);
  }

  function toggleExpanded(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

  async function handleRemoveContribution(goalId: number, contributionId: number) {
    const result = await removeContribution({
      input: { savingGoalId: goalId, contributionId },
    });
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.removeContribution.errors);
    if (msg) return toast.error(msg);
    toast.success("Contribution removed");
    refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Saving Goals</h1>
          <p className="text-sm text-muted-foreground">
            Set targets and track money you put aside towards them.
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
        {visibleGoals.map((goal) => {
          const progress =
            goal.targetAmount > 0
              ? Math.min(100, (goal.savedAmount / goal.targetAmount) * 100)
              : 0;
          const isOpen = expanded.has(goal.id);

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
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFunding(goal)}
                      disabled={goal.isCompleted}
                    >
                      Add funds
                    </Button>
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

                {goal.contributions.length > 0 && (
                  <div className="border-t pt-3">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(goal.id)}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {isOpen ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                      {goal.contributions.length}{" "}
                      {goal.contributions.length === 1
                        ? "contribution"
                        : "contributions"}
                    </button>
                    {isOpen && (
                      <ul className="mt-2 space-y-1">
                        {goal.contributions.map((contribution) => (
                          <li
                            key={contribution.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {formatDate(contribution.date)}
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="font-medium">
                                {formatCurrency(contribution.amount)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() =>
                                  handleRemoveContribution(
                                    goal.id,
                                    contribution.id,
                                  )
                                }
                                aria-label="Remove contribution"
                              >
                                <Trash2 className="text-destructive" />
                              </Button>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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

      <ContributionDialog
        open={funding !== undefined}
        onOpenChange={(open) => !open && setFunding(undefined)}
        savingGoal={funding}
        onSaved={refetch}
      />

      <ConfirmDialog
        open={deleting !== undefined}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Delete saving goal?"
        description={`"${deleting?.name}" and its contributions will be permanently removed.`}
        onConfirm={confirmDelete}
        pending={deletePending}
      />
    </div>
  );
}

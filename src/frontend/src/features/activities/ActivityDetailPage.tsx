import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useMutation } from "urql";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, UserPlus, X } from "lucide-react";

import {
  DeleteActivityExpenseMutation,
  RemoveActivityMemberMutation,
} from "@/graphql/operations";
import { combinedErrorMessage, payloadErrorMessage } from "@/lib/graphql-error";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useActivity } from "./useActivity";
import { memberLabel } from "./member";
import { AddMemberDialog } from "./AddMemberDialog";
import { ActivityExpenseFormDialog } from "./ActivityExpenseFormDialog";

export function ActivityDetailPage() {
  const { id } = useParams();
  const activityId = Number(id);
  const auth = useAuth();
  const currentEmail = auth.user?.profile?.email;

  const { activity, expenses, fetching, error, refetch } = useActivity(activityId);
  const [, removeMember] = useMutation(RemoveActivityMemberMutation);
  const [, deleteExpense] = useMutation(DeleteActivityExpenseMutation);

  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState<{ id: number; description: string } | undefined>();
  const [deletePending, setDeletePending] = useState(false);

  const members = activity?.members ?? [];
  const nameOf = (userId: number) =>
    memberLabel(members.find((member) => member.userId === userId), userId);
  const currentUserId = members.find((member) => member.email && member.email === currentEmail)?.userId;

  async function onRemoveMember(userId: number) {
    const result = await removeMember({ input: { activityId, userId } });
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.removeActivityMember.errors);
    if (msg) return toast.error(msg);
    toast.success("Member removed");
    refetch();
  }

  async function confirmDeleteExpense() {
    if (!deletingExpense) return;
    setDeletePending(true);
    const result = await deleteExpense({ input: { id: deletingExpense.id } });
    setDeletePending(false);
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.deleteActivityExpense.errors);
    if (msg) return toast.error(msg);
    toast.success("Expense deleted");
    setDeletingExpense(undefined);
    refetch();
  }

  if (!Number.isNaN(activityId) && !fetching && !error && !activity) {
    return (
      <div className="space-y-4">
        <Link
          to="/activities"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Activities
        </Link>
        <p className="py-8 text-center text-muted-foreground">Activity not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/activities"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Activities
      </Link>

      {error && !fetching && (
        <p className="py-8 text-center text-destructive">{combinedErrorMessage(error)}</p>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{activity?.name ?? "…"}</h1>
          {activity?.description && (
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          )}
        </div>
        {activity && (
          <Button onClick={() => setExpenseOpen(true)}>
            <Plus /> New expense
          </Button>
        )}
      </div>

      {activity && (
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Members */}
          <Card>
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">Members</h2>
                <Button variant="ghost" size="sm" onClick={() => setAddMemberOpen(true)}>
                  <UserPlus className="size-4" /> Add
                </Button>
              </div>
              <ul className="space-y-1">
                {members.map((member) => (
                  <li
                    key={member.userId}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="min-w-0 truncate">
                      {memberLabel(member, member.userId)}
                      {member.userId === activity.createdByUserId && (
                        <span className="ml-2 text-xs text-muted-foreground">creator</span>
                      )}
                    </span>
                    {member.userId !== activity.createdByUserId && (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => onRemoveMember(member.userId)}
                        aria-label="Remove member"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Balances */}
          <Card>
            <CardContent className="space-y-3 p-6">
              <h2 className="text-sm font-medium text-muted-foreground">Balances</h2>
              <ul className="space-y-1">
                {activity.balances.map((balance) => (
                  <li
                    key={balance.userId}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="min-w-0 truncate">{nameOf(balance.userId)}</span>
                    <span
                      className={
                        balance.net > 0
                          ? "font-medium tabular-nums text-emerald-600"
                          : balance.net < 0
                            ? "font-medium tabular-nums text-destructive"
                            : "tabular-nums text-muted-foreground"
                      }
                    >
                      {balance.net > 0 ? "+" : balance.net < 0 ? "-" : ""}
                      {formatCurrency(Math.abs(balance.net))}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                Positive means the activity owes them; negative means they owe the activity.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Expenses */}
      {activity && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Expenses</h2>
          {expenses.length === 0 ? (
            <p className="rounded-lg border py-8 text-center text-muted-foreground">
              No expenses yet.
            </p>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <Card key={expense.id}>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(expense.date)} · {nameOf(expense.paidByUserId)} paid
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold tabular-nums">
                          {formatCurrency(expense.amount)}
                        </span>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            setDeletingExpense({ id: expense.id, description: expense.description })
                          }
                          aria-label="Delete expense"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <ul className="border-t pt-2 text-sm text-muted-foreground">
                      {expense.splits.map((split) => (
                        <li
                          key={split.userId}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="min-w-0 truncate">{nameOf(split.userId)}</span>
                          <span className="tabular-nums">
                            {formatCurrency(split.amount)}
                            {split.percentage != null && ` (${split.percentage}%)`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activity && (
        <>
          <AddMemberDialog
            open={addMemberOpen}
            onOpenChange={setAddMemberOpen}
            activityId={activityId}
            onSaved={refetch}
          />
          <ActivityExpenseFormDialog
            open={expenseOpen}
            onOpenChange={setExpenseOpen}
            activityId={activityId}
            members={members}
            defaultPayerUserId={currentUserId}
            onSaved={refetch}
          />
        </>
      )}

      <ConfirmDialog
        open={deletingExpense !== undefined}
        onOpenChange={(open) => !open && setDeletingExpense(undefined)}
        title="Delete expense?"
        description={`"${deletingExpense?.description}" will be permanently removed.`}
        onConfirm={confirmDeleteExpense}
        pending={deletePending}
      />
    </div>
  );
}

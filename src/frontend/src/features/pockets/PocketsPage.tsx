import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "urql";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { DeletePocketMutation } from "@/graphql/operations";
import type { PocketFieldsFragment } from "@/gql/graphql";
import { payloadErrorMessage, combinedErrorMessage } from "@/lib/graphql-error";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { usePockets } from "./usePockets";
import { PocketFormDialog } from "./PocketFormDialog";
import { PocketTransactionActions } from "./PocketTransactionActions";

export function PocketsPage() {
  const { pockets, fetching, error, refetch } = usePockets();
  const [, deletePocket] = useMutation(DeletePocketMutation);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PocketFieldsFragment | undefined>();
  const [deleting, setDeleting] = useState<PocketFieldsFragment | undefined>();
  const [deletePending, setDeletePending] = useState(false);

  const topLevel = pockets.filter((pocket) => pocket.parentPocketId == null);
  const childrenOf = (parentId: number) =>
    pockets.filter((pocket) => pocket.parentPocketId === parentId);
  const total = pockets.reduce((sum, pocket) => sum + pocket.balance, 0);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(pocket: PocketFieldsFragment) {
    setEditing(pocket);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletePending(true);
    const result = await deletePocket({ input: { id: deleting.id } });
    setDeletePending(false);
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.deletePocket.errors);
    if (msg) return toast.error(msg);
    toast.success("Pocket deleted");
    setDeleting(undefined);
    refetch();
  }

  function actions(pocket: PocketFieldsFragment) {
    return (
      <div className="flex gap-1">
        <PocketTransactionActions pocketId={pocket.id} onSaved={refetch} compact />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => openEdit(pocket)}
          aria-label="Edit pocket"
        >
          <Pencil />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleting(pocket)}
          aria-label="Delete pocket"
        >
          <Trash2 className="text-destructive" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pockets</h1>
          <p className="text-sm text-muted-foreground">
            Separate accounts and sub-pockets for your money.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> New pocket
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
      {!fetching && !error && pockets.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          No pockets yet.
        </p>
      )}

      {!fetching && !error && pockets.length > 0 && (
        <>
          <div className="flex items-center justify-between rounded-lg border bg-secondary/30 px-6 py-4">
            <span className="text-sm font-medium text-muted-foreground">
              Total across all pockets
            </span>
            <span className="text-lg font-semibold">
              {formatCurrency(total)}
            </span>
          </div>

          <div className="space-y-4">
            {topLevel.map((pocket) => {
              const children = childrenOf(pocket.id);
              return (
                <Card key={pocket.id}>
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <Link
                          to={`/pockets/${pocket.id}`}
                          className="font-semibold hover:underline"
                        >
                          {pocket.name}
                        </Link>
                        {pocket.description && (
                          <p className="text-sm text-muted-foreground">
                            {pocket.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold tabular-nums">
                          {formatCurrency(pocket.balance)}
                        </span>
                        {actions(pocket)}
                      </div>
                    </div>

                    {children.length > 0 && (
                      <ul className="space-y-1 border-t pt-3">
                        {children.map((child) => (
                          <li
                            key={child.id}
                            className="flex items-center justify-between gap-4 pl-4"
                          >
                            <div className="min-w-0">
                              <Link
                                to={`/pockets/${child.id}`}
                                className="text-sm font-medium hover:underline"
                              >
                                {child.name}
                              </Link>
                              {child.description && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {child.description}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium tabular-nums">
                                {formatCurrency(child.balance)}
                              </span>
                              {actions(child)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <PocketFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        pocket={editing}
        pockets={pockets}
        onSaved={refetch}
      />

      <ConfirmDialog
        open={deleting !== undefined}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Delete pocket?"
        description={`"${deleting?.name}" will be permanently removed. Pockets with a balance, nested pockets, or a linked saving goal can't be deleted.`}
        onConfirm={confirmDelete}
        pending={deletePending}
      />
    </div>
  );
}

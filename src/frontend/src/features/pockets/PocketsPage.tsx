import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "urql";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { DeletePocketMutation } from "@/graphql/operations";
import type { PocketFieldsFragment } from "@/gql/graphql";
import type { PocketSort } from "@/graphql/enums";
import { payloadErrorMessage, combinedErrorMessage } from "@/lib/graphql-error";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { SortSelect } from "@/components/sort-select";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { usePockets } from "./usePockets";
import { PocketFormDialog } from "./PocketFormDialog";
import { PocketTransactionActions } from "./PocketTransactionActions";

const SORT_OPTIONS: { value: PocketSort; label: string }[] = [
  { value: "NAME_ASC", label: "Name (A–Z)" },
  { value: "NAME_DESC", label: "Name (Z–A)" },
  { value: "BALANCE_DESC", label: "Balance (high–low)" },
  { value: "BALANCE_ASC", label: "Balance (low–high)" },
];

export function PocketsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<PocketSort>("NAME_ASC");
  const variables = useMemo(
    () => ({ search: search || undefined, sort }),
    [search, sort],
  );

  const { pockets, fetching, error, refetch } = usePockets(variables);
  const [, deletePocket] = useMutation(DeletePocketMutation);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PocketFieldsFragment | undefined>();
  const [deleting, setDeleting] = useState<PocketFieldsFragment | undefined>();
  const [deletePending, setDeletePending] = useState(false);

  // With server-side search the result set may exclude a child's parent; render
  // such children at the top level so nothing is hidden behind a missing parent.
  const presentIds = new Set(pockets.map((pocket) => pocket.id));
  const topLevel = pockets.filter(
    (pocket) =>
      pocket.parentPocketId == null || !presentIds.has(pocket.parentPocketId),
  );
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
      <>
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
      </>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pockets"
        description="Separate accounts and sub-pockets for your money."
        action={
          <Button onClick={openCreate}>
            <Plus /> New pocket
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search pockets…"
          className="sm:max-w-xs"
        />
        <SortSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />
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
          {search ? "No pockets match your search." : "No pockets yet."}
        </p>
      )}

      {!fetching && !error && pockets.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
            <span className="text-sm font-medium text-muted-foreground">
              Total across all pockets
            </span>
            <span className="text-xl font-semibold tabular-nums text-primary">
              {formatCurrency(total)}
            </span>
          </div>

          <div className="space-y-4">
            {topLevel.map((pocket) => {
              const children = childrenOf(pocket.id);
              return (
                <Card key={pocket.id}>
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
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
                      <span className="shrink-0 text-lg font-semibold tabular-nums">
                        {formatCurrency(pocket.balance)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {actions(pocket)}
                    </div>

                    {children.length > 0 && (
                      <ul className="space-y-2 border-t pt-3">
                        {children.map((child) => (
                          <li
                            key={child.id}
                            className="flex flex-col gap-2 border-l-2 border-border pl-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
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
                            <div className="flex items-center justify-between gap-2 sm:justify-end">
                              <span className="text-sm font-medium tabular-nums">
                                {formatCurrency(child.balance)}
                              </span>
                              <div className="flex items-center gap-1">
                                {actions(child)}
                              </div>
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

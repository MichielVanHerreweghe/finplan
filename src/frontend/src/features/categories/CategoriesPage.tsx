import { useMemo, useState } from "react";
import { useMutation } from "urql";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { DeleteCategoryMutation } from "@/graphql/operations";
import type { NameSort } from "@/graphql/enums";
import { payloadErrorMessage, combinedErrorMessage } from "@/lib/graphql-error";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { SortSelect } from "@/components/sort-select";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useCategories } from "./useCategories";
import {
  CategoryFormDialog,
  type CategoryListItem,
} from "./CategoryFormDialog";

const SORT_OPTIONS: { value: NameSort; label: string }[] = [
  { value: "NAME_ASC", label: "Name (A–Z)" },
  { value: "NAME_DESC", label: "Name (Z–A)" },
];

export function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<NameSort>("NAME_ASC");
  const variables = useMemo(
    () => ({ search: search || undefined, sort }),
    [search, sort],
  );

  const { categories, fetching, error, refetch } = useCategories(variables);
  const [, deleteCategory] = useMutation(DeleteCategoryMutation);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryListItem | undefined>();
  const [deleting, setDeleting] = useState<CategoryListItem | undefined>();
  const [deletePending, setDeletePending] = useState(false);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(category: CategoryListItem) {
    setEditing(category);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletePending(true);
    const result = await deleteCategory({ input: { id: deleting.id } });
    setDeletePending(false);
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(
      result.data?.deleteTransactionCategory.errors,
    );
    if (msg) return toast.error(msg);
    toast.success("Category deleted");
    setDeleting(undefined);
    refetch();
  }

  const stateMessage = fetching
    ? "Loading…"
    : error
      ? combinedErrorMessage(error)
      : categories.length === 0
        ? search
          ? "No categories match your search."
          : "No categories yet."
        : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize your transactions into categories."
        action={
          <Button onClick={openCreate}>
            <Plus /> New category
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search categories…"
          className="sm:max-w-xs"
        />
        <SortSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />
      </div>

      {stateMessage ? (
        <p
          className={`py-8 text-center text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}
        >
          {stateMessage}
        </p>
      ) : (
        <div className="divide-y rounded-xl border bg-card">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <span className="min-w-0 truncate font-medium">{category.name}</span>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(category)}
                  aria-label="Edit category"
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleting(category)}
                  aria-label="Delete category"
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        onSaved={refetch}
      />

      <ConfirmDialog
        open={deleting !== undefined}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Delete category?"
        description={`"${deleting?.name}" will be permanently removed.`}
        onConfirm={confirmDelete}
        pending={deletePending}
      />
    </div>
  );
}

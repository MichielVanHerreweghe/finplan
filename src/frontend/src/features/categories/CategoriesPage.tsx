import { useState } from "react";
import { useMutation } from "urql";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { DeleteCategoryMutation } from "@/graphql/operations";
import { payloadErrorMessage, combinedErrorMessage } from "@/lib/graphql-error";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useCategories } from "./useCategories";
import {
  CategoryFormDialog,
  type CategoryListItem,
} from "./CategoryFormDialog";

export function CategoriesPage() {
  const { categories, fetching, error, refetch } = useCategories();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Organize your transactions into categories.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> New category
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetching && (
              <TableRow>
                <TableCell colSpan={2} className="py-8 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {error && !fetching && (
              <TableRow>
                <TableCell colSpan={2} className="py-8 text-center text-destructive">
                  {combinedErrorMessage(error)}
                </TableCell>
              </TableRow>
            )}
            {!fetching && !error && categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="py-8 text-center text-muted-foreground">
                  No categories yet.
                </TableCell>
              </TableRow>
            )}
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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

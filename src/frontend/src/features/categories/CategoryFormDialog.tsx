import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "urql";
import { toast } from "sonner";

import {
  CreateCategoryMutation,
  UpdateCategoryMutation,
} from "@/graphql/operations";
import { payloadErrorMessage } from "@/lib/graphql-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

type FormValues = z.infer<typeof schema>;

export interface CategoryListItem {
  id: number;
  name: string;
}

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CategoryListItem;
  /** Receives the new category's id on create (undefined on edit) so callers can auto-select it. */
  onSaved: (createdId?: number) => void;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSaved,
}: CategoryFormDialogProps) {
  const isEdit = category !== undefined;
  const [, createCategory] = useMutation(CreateCategoryMutation);
  const [, updateCategory] = useMutation(UpdateCategoryMutation);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  // Sync the form whenever the dialog opens for a new target.
  useEffect(() => {
    if (open) reset({ name: category?.name ?? "" });
  }, [open, category, reset]);

  async function onSubmit(values: FormValues) {
    let createdId: number | undefined;
    if (isEdit) {
      const result = await updateCategory({
        input: { id: category.id, name: values.name },
      });
      if (result.error) return toast.error(result.error.message);
      const msg = payloadErrorMessage(
        result.data?.updateTransactionCategory.errors,
      );
      if (msg) return toast.error(msg);
      toast.success("Category updated");
    } else {
      const result = await createCategory({ input: { name: values.name } });
      if (result.error) return toast.error(result.error.message);
      const msg = payloadErrorMessage(
        result.data?.createTransactionCategory.errors,
      );
      if (msg) return toast.error(msg);
      createdId = result.data?.createTransactionCategory.id ?? undefined;
      toast.success("Category created");
    }
    onOpenChange(false);
    onSaved(createdId);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit category" : "New category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              placeholder="e.g. Groceries"
              autoFocus
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

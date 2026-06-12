import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "urql";
import { toast } from "sonner";

import {
  CreatePocketMutation,
  UpdatePocketMutation,
} from "@/graphql/operations";
import type { PocketFieldsFragment } from "@/gql/graphql";
import { payloadErrorMessage } from "@/lib/graphql-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Sentinel for "no parent" (top-level pocket).
const TOP_LEVEL = "none";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  // Select value: "none" or the parent pocket id as a string.
  parentPocketId: z.string(),
  // Opening balance already in the pocket — not recorded as a transaction.
  startingAmount: z.coerce.number().min(0, "Cannot be negative"),
});

type FormValues = z.input<typeof schema>;

interface PocketFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pocket?: PocketFieldsFragment;
  /** All pockets, used to offer valid parents (top-level only, excluding self). */
  pockets: PocketFieldsFragment[];
  /** Receives the new pocket's id on create (undefined on edit) so callers can auto-select it. */
  onSaved: (createdId?: number) => void;
}

export function PocketFormDialog({
  open,
  onOpenChange,
  pocket,
  pockets,
  onSaved,
}: PocketFormDialogProps) {
  const isEdit = pocket !== undefined;
  const [, createPocket] = useMutation(CreatePocketMutation);
  const [, updatePocket] = useMutation(UpdatePocketMutation);

  // Nesting is one level deep: a parent must itself be top-level, and a pocket
  // can't be its own parent. A pocket that already has children can't be nested,
  // but that's enforced server-side; here we just offer the valid top-level options.
  const parentOptions = pockets.filter(
    (p) => p.parentPocketId == null && p.id !== pocket?.id,
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      parentPocketId: TOP_LEVEL,
      startingAmount: 0,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: pocket?.name ?? "",
      description: pocket?.description ?? "",
      parentPocketId:
        pocket?.parentPocketId != null
          ? String(pocket.parentPocketId)
          : TOP_LEVEL,
      startingAmount: pocket?.startingAmount ?? 0,
    });
  }, [open, pocket, reset]);

  async function onSubmit(values: FormValues) {
    const parsed = schema.parse(values);
    const input = {
      name: parsed.name,
      description: parsed.description?.length ? parsed.description : null,
      parentPocketId:
        parsed.parentPocketId === TOP_LEVEL
          ? null
          : Number(parsed.parentPocketId),
      startingAmount: parsed.startingAmount,
    };

    let createdId: number | undefined;
    if (isEdit) {
      const result = await updatePocket({ input: { id: pocket.id, ...input } });
      if (result.error) return toast.error(result.error.message);
      const msg = payloadErrorMessage(result.data?.updatePocket.errors);
      if (msg) return toast.error(msg);
      toast.success("Pocket updated");
    } else {
      const result = await createPocket({ input });
      if (result.error) return toast.error(result.error.message);
      const msg = payloadErrorMessage(result.data?.createPocket.errors);
      if (msg) return toast.error(msg);
      createdId = result.data?.createPocket.id ?? undefined;
      toast.success("Pocket created");
    }
    onOpenChange(false);
    onSaved(createdId);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit pocket" : "New pocket"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pocket-name">Name</Label>
            <Input
              id="pocket-name"
              placeholder="e.g. Checking"
              autoFocus
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pocket-description">Description</Label>
            <Input
              id="pocket-description"
              placeholder="Optional"
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pocket-starting">Starting amount</Label>
            <Input
              id="pocket-starting"
              type="number"
              step="0.01"
              min="0"
              {...register("startingAmount")}
            />
            {errors.startingAmount && (
              <p className="text-sm text-destructive">
                {errors.startingAmount.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Money already in this pocket. Not recorded as a transaction.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Parent pocket</Label>
            <Controller
              control={control}
              name="parentPocketId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TOP_LEVEL}>None (top-level)</SelectItem>
                    {parentOptions.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground">
              Optional — nest this pocket under another account.
            </p>
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

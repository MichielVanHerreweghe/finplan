import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "urql";
import { toast } from "sonner";

import {
  CreateSavingGoalMutation,
  UpdateSavingGoalMutation,
} from "@/graphql/operations";
import type { SavingGoalFieldsFragment } from "@/gql/graphql";
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
  description: z.string().trim().optional(),
  targetAmount: z.coerce.number().positive("Target must be greater than 0"),
  // Empty string means "no deadline".
  deadline: z.string(),
});

type FormValues = z.input<typeof schema>;

interface SavingGoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savingGoal?: SavingGoalFieldsFragment;
  onSaved: () => void;
}

export function SavingGoalFormDialog({
  open,
  onOpenChange,
  savingGoal,
  onSaved,
}: SavingGoalFormDialogProps) {
  const isEdit = savingGoal !== undefined;
  const [, createSavingGoal] = useMutation(CreateSavingGoalMutation);
  const [, updateSavingGoal] = useMutation(UpdateSavingGoalMutation);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      targetAmount: 0,
      deadline: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: savingGoal?.name ?? "",
      description: savingGoal?.description ?? "",
      targetAmount: savingGoal?.targetAmount ?? 0,
      deadline: savingGoal?.deadline ?? "",
    });
  }, [open, savingGoal, reset]);

  async function onSubmit(values: FormValues) {
    const parsed = schema.parse(values);
    const input = {
      name: parsed.name,
      description: parsed.description?.length ? parsed.description : null,
      targetAmount: parsed.targetAmount,
      deadline: parsed.deadline.length ? parsed.deadline : null,
    };

    if (isEdit) {
      const result = await updateSavingGoal({
        input: { id: savingGoal.id, ...input },
      });
      if (result.error) return toast.error(result.error.message);
      const msg = payloadErrorMessage(result.data?.updateSavingGoal.errors);
      if (msg) return toast.error(msg);
      toast.success("Saving goal updated");
    } else {
      const result = await createSavingGoal({ input });
      if (result.error) return toast.error(result.error.message);
      const msg = payloadErrorMessage(result.data?.createSavingGoal.errors);
      if (msg) return toast.error(msg);
      toast.success("Saving goal created");
    }
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit saving goal" : "New saving goal"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sg-name">Name</Label>
            <Input
              id="sg-name"
              placeholder="e.g. New laptop"
              autoFocus
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sg-description">Description</Label>
            <Input
              id="sg-description"
              placeholder="Optional"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sg-target">Target amount</Label>
              <Input
                id="sg-target"
                type="number"
                step="0.01"
                min="0"
                {...register("targetAmount")}
              />
              {errors.targetAmount && (
                <p className="text-sm text-destructive">
                  {errors.targetAmount.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sg-deadline">Deadline</Label>
              <Input id="sg-deadline" type="date" {...register("deadline")} />
              <p className="text-xs text-muted-foreground">Optional</p>
            </div>
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

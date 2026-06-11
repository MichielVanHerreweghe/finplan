import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "urql";
import { toast } from "sonner";

import { AddContributionMutation } from "@/graphql/operations";
import type { SavingGoalFieldsFragment } from "@/gql/graphql";
import { payloadErrorMessage } from "@/lib/graphql-error";
import { todayIso } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const schema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
});

type FormValues = z.input<typeof schema>;

interface ContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savingGoal?: SavingGoalFieldsFragment;
  onSaved: () => void;
}

export function ContributionDialog({
  open,
  onOpenChange,
  savingGoal,
  onSaved,
}: ContributionDialogProps) {
  const [, addContribution] = useMutation(AddContributionMutation);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0, date: todayIso() },
  });

  useEffect(() => {
    if (!open) return;
    reset({ amount: 0, date: todayIso() });
  }, [open, reset]);

  async function onSubmit(values: FormValues) {
    if (!savingGoal) return;
    const parsed = schema.parse(values);
    const result = await addContribution({
      input: {
        savingGoalId: savingGoal.id,
        amount: parsed.amount,
        date: parsed.date,
      },
    });
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.addContribution.errors);
    if (msg) return toast.error(msg);
    toast.success("Funds added");
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add funds</DialogTitle>
          <DialogDescription>
            Put money towards “{savingGoal?.name}”.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contrib-amount">Amount</Label>
            <Input
              id="contrib-amount"
              type="number"
              step="0.01"
              min="0"
              autoFocus
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contrib-date">Date</Label>
            <Input id="contrib-date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
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
              {isSubmitting ? "Adding…" : "Add funds"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "urql";
import { toast } from "sonner";

import { CreateActivityExpenseMutation } from "@/graphql/operations";
import { payloadErrorMessage } from "@/lib/graphql-error";
import { formatCurrency, todayIso } from "@/lib/format";
import { memberLabel, type ActivityMember } from "./member";
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

const cents = (value: number) => Math.round(value * 100);

const schema = z
  .object({
    description: z.string().trim().min(1, "Description is required"),
    date: z.string().min(1, "Date is required"),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    paidByUserId: z.string().min(1, "Select who paid"),
    splitType: z.enum(["EQUAL", "EXACT", "PERCENTAGE"]),
    participants: z.array(
      z.object({
        userId: z.number(),
        included: z.boolean(),
        // String inputs; only read for the matching split type.
        exact: z.string(),
        percentage: z.string(),
      }),
    ),
  })
  .superRefine((values, ctx) => {
    const included = values.participants.filter((p) => p.included);
    if (included.length === 0) {
      ctx.addIssue({
        path: ["participants"],
        code: z.ZodIssueCode.custom,
        message: "Select at least one participant",
      });
      return;
    }
    if (values.splitType === "EXACT") {
      const sum = included.reduce((total, p) => total + (Number(p.exact) || 0), 0);
      if (cents(sum) !== cents(values.amount)) {
        ctx.addIssue({
          path: ["participants"],
          code: z.ZodIssueCode.custom,
          message: `Amounts must add up to ${formatCurrency(values.amount)} (now ${formatCurrency(sum)})`,
        });
      }
    }
    if (values.splitType === "PERCENTAGE") {
      const sum = included.reduce((total, p) => total + (Number(p.percentage) || 0), 0);
      if (cents(sum) !== cents(100)) {
        ctx.addIssue({
          path: ["participants"],
          code: z.ZodIssueCode.custom,
          message: `Percentages must add up to 100 (now ${sum})`,
        });
      }
    }
  });

type FormValues = z.input<typeof schema>;

interface ActivityExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityId: number;
  members: ActivityMember[];
  /** Defaults the "paid by" select, e.g. to the current user. */
  defaultPayerUserId?: number;
  onSaved: () => void;
}

export function ActivityExpenseFormDialog({
  open,
  onOpenChange,
  activityId,
  members,
  defaultPayerUserId,
  onSaved,
}: ActivityExpenseFormDialogProps) {
  const [, createExpense] = useMutation(CreateActivityExpenseMutation);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      date: todayIso(),
      amount: 0,
      paidByUserId: "",
      splitType: "EQUAL",
      participants: [],
    },
  });

  const { fields } = useFieldArray({ control, name: "participants" });

  useEffect(() => {
    if (!open) return;
    reset({
      description: "",
      date: todayIso(),
      amount: 0,
      paidByUserId: String(defaultPayerUserId ?? members[0]?.userId ?? ""),
      splitType: "EQUAL",
      participants: members.map((member) => ({
        userId: member.userId,
        included: true,
        exact: "",
        percentage: "",
      })),
    });
  }, [open, members, defaultPayerUserId, reset]);

  const splitType = watch("splitType");
  const amount = Number(watch("amount")) || 0;
  const participants = watch("participants");
  const includedCount = participants?.filter((p) => p.included).length ?? 0;
  const equalShare = includedCount > 0 ? amount / includedCount : 0;

  async function onSubmit(values: FormValues) {
    const parsed = schema.parse(values);
    const splits = parsed.participants
      .filter((p) => p.included)
      .map((p) => ({
        userId: p.userId,
        exactAmount: parsed.splitType === "EXACT" ? Number(p.exact) : null,
        percentage: parsed.splitType === "PERCENTAGE" ? Number(p.percentage) : null,
      }));

    const result = await createExpense({
      input: {
        activityId,
        description: parsed.description,
        date: parsed.date,
        amount: parsed.amount,
        paidByUserId: Number(parsed.paidByUserId),
        splitType: parsed.splitType,
        splits,
      },
    });
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.createActivityExpense.errors);
    if (msg) return toast.error(msg);
    toast.success("Expense added");
    onOpenChange(false);
    onSaved();
  }

  const nameOf = (userId: number) =>
    memberLabel(members.find((member) => member.userId === userId), userId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expense-description">Description</Label>
            <Input
              id="expense-description"
              placeholder="e.g. Dinner"
              autoFocus
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense-date">Date</Label>
              <Input id="expense-date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount</Label>
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0"
                {...register("amount")}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Paid by</Label>
            <Controller
              control={control}
              name="paidByUserId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.userId} value={String(member.userId)}>
                        {memberLabel(member, member.userId)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paidByUserId && (
              <p className="text-sm text-destructive">{errors.paidByUserId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Split</Label>
            <Controller
              control={control}
              name="splitType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EQUAL">Equally</SelectItem>
                    <SelectItem value="EXACT">By exact amounts</SelectItem>
                    <SelectItem value="PERCENTAGE">By percentage</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Split between</Label>
            <div className="space-y-2 rounded-md border p-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="size-4 shrink-0 accent-primary"
                    {...register(`participants.${index}.included`)}
                  />
                  <span className="flex-1 truncate text-sm">
                    {nameOf(field.userId)}
                  </span>
                  {splitType === "EQUAL" && participants?.[index]?.included && (
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {formatCurrency(equalShare)}
                    </span>
                  )}
                  {splitType === "EXACT" && (
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-24"
                      placeholder="0.00"
                      disabled={!participants?.[index]?.included}
                      {...register(`participants.${index}.exact`)}
                    />
                  )}
                  {splitType === "PERCENTAGE" && (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-20"
                        placeholder="0"
                        disabled={!participants?.[index]?.included}
                        {...register(`participants.${index}.percentage`)}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.participants && (
              <p className="text-sm text-destructive">
                {errors.participants.message ?? errors.participants.root?.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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

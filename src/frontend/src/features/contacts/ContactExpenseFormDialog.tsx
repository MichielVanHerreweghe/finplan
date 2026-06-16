import { useEffect } from "react";
import { Controller, useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "urql";
import { toast } from "sonner";

import { CreateContactExpenseMutation } from "@/graphql/operations";
import { payloadErrorMessage } from "@/lib/graphql-error";
import { formatCurrency, todayIso } from "@/lib/format";
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
    // Your share and their share, as strings; only read for the matching split type.
    yourExact: z.string(),
    theirExact: z.string(),
    yourPercentage: z.string(),
    theirPercentage: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.splitType === "EXACT") {
      const sum = (Number(values.yourExact) || 0) + (Number(values.theirExact) || 0);
      if (cents(sum) !== cents(values.amount)) {
        ctx.addIssue({
          path: ["yourExact"],
          code: z.ZodIssueCode.custom,
          message: `Amounts must add up to ${formatCurrency(values.amount)} (now ${formatCurrency(sum)})`,
        });
      }
    }
    if (values.splitType === "PERCENTAGE") {
      const sum = (Number(values.yourPercentage) || 0) + (Number(values.theirPercentage) || 0);
      if (cents(sum) !== cents(100)) {
        ctx.addIssue({
          path: ["yourPercentage"],
          code: z.ZodIssueCode.custom,
          message: `Percentages must add up to 100 (now ${sum})`,
        });
      }
    }
  });

type FormValues = z.input<typeof schema>;

interface ContactExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: number;
  meId: number;
  otherUserId: number;
  otherLabel: string;
  onSaved: () => void;
}

export function ContactExpenseFormDialog({
  open,
  onOpenChange,
  contactId,
  meId,
  otherUserId,
  otherLabel,
  onSaved,
}: ContactExpenseFormDialogProps) {
  const [, createExpense] = useMutation(CreateContactExpenseMutation);

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
      paidByUserId: String(meId),
      splitType: "EQUAL",
      yourExact: "",
      theirExact: "",
      yourPercentage: "",
      theirPercentage: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      description: "",
      date: todayIso(),
      amount: 0,
      paidByUserId: String(meId),
      splitType: "EQUAL",
      yourExact: "",
      theirExact: "",
      yourPercentage: "",
      theirPercentage: "",
    });
  }, [open, meId, reset]);

  const splitType = watch("splitType");
  const amount = Number(watch("amount")) || 0;
  const equalShare = amount / 2;

  async function onSubmit(values: FormValues) {
    const parsed = schema.parse(values);

    const splits = [
      {
        userId: meId,
        exactAmount: parsed.splitType === "EXACT" ? Number(parsed.yourExact) : null,
        percentage: parsed.splitType === "PERCENTAGE" ? Number(parsed.yourPercentage) : null,
      },
      {
        userId: otherUserId,
        exactAmount: parsed.splitType === "EXACT" ? Number(parsed.theirExact) : null,
        percentage: parsed.splitType === "PERCENTAGE" ? Number(parsed.theirPercentage) : null,
      },
    ];

    const result = await createExpense({
      input: {
        contactId,
        description: parsed.description,
        date: parsed.date,
        amount: parsed.amount,
        paidByUserId: Number(parsed.paidByUserId),
        splitType: parsed.splitType,
        splits,
      },
    });
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.createContactExpense.errors);
    if (msg) return toast.error(msg);
    toast.success("Expense added");
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-expense-description">Description</Label>
            <Input
              id="contact-expense-description"
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
              <Label htmlFor="contact-expense-date">Date</Label>
              <Input id="contact-expense-date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-expense-amount">Amount</Label>
              <Input
                id="contact-expense-amount"
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(meId)}>You</SelectItem>
                    <SelectItem value={String(otherUserId)}>{otherLabel}</SelectItem>
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

          <div className="space-y-2 rounded-md border p-3">
            <Row
              label="You"
              splitType={splitType}
              equalShare={equalShare}
              exactField={register("yourExact")}
              percentageField={register("yourPercentage")}
            />
            <Row
              label={otherLabel}
              splitType={splitType}
              equalShare={equalShare}
              exactField={register("theirExact")}
              percentageField={register("theirPercentage")}
            />
            {(errors.yourExact || errors.yourPercentage) && (
              <p className="text-sm text-destructive">
                {errors.yourExact?.message ?? errors.yourPercentage?.message}
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

interface RowProps {
  label: string;
  splitType: "EQUAL" | "EXACT" | "PERCENTAGE";
  equalShare: number;
  exactField: UseFormRegisterReturn;
  percentageField: UseFormRegisterReturn;
}

function Row({ label, splitType, equalShare, exactField, percentageField }: RowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex-1 truncate text-sm">{label}</span>
      {splitType === "EQUAL" && (
        <span className="text-sm text-muted-foreground tabular-nums">
          {formatCurrency(equalShare)}
        </span>
      )}
      {splitType === "EXACT" && (
        <Input type="number" step="0.01" min="0" className="w-24" placeholder="0.00" {...exactField} />
      )}
      {splitType === "PERCENTAGE" && (
        <div className="flex items-center gap-1">
          <Input type="number" step="0.01" min="0" className="w-20" placeholder="0" {...percentageField} />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      )}
    </div>
  );
}

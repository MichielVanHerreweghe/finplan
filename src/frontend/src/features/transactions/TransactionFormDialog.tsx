import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "urql";
import { toast } from "sonner";

import {
  CreateTransactionMutation,
  UpdateTransactionMutation,
} from "@/graphql/operations";
import type { TransactionFieldsFragment } from "@/gql/graphql";
import { payloadErrorMessage } from "@/lib/graphql-error";
import { todayIso } from "@/lib/format";
import { useCategories } from "@/features/categories/useCategories";
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

const UNCATEGORIZED = "none";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  date: z.string().min(1, "Date is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  // Select value: "none" or the category id as a string.
  categoryId: z.string(),
});

type FormValues = z.input<typeof schema>;

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: TransactionFieldsFragment;
  onSaved: () => void;
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
  onSaved,
}: TransactionFormDialogProps) {
  const isEdit = transaction !== undefined;
  const { categories } = useCategories();
  const [, createTransaction] = useMutation(CreateTransactionMutation);
  const [, updateTransaction] = useMutation(UpdateTransactionMutation);

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
      date: todayIso(),
      amount: 0,
      type: "EXPENSE",
      categoryId: UNCATEGORIZED,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: transaction?.name ?? "",
      date: transaction?.date ?? todayIso(),
      amount: transaction?.amount ?? 0,
      type: transaction?.type === "INCOME" ? "INCOME" : "EXPENSE",
      categoryId:
        transaction?.categoryId != null
          ? String(transaction.categoryId)
          : UNCATEGORIZED,
    });
  }, [open, transaction, reset]);

  async function onSubmit(values: FormValues) {
    const parsed = schema.parse(values);
    const input = {
      name: parsed.name,
      date: parsed.date,
      amount: parsed.amount,
      type: parsed.type,
      categoryId:
        parsed.categoryId === UNCATEGORIZED ? null : Number(parsed.categoryId),
    };

    if (isEdit) {
      const result = await updateTransaction({
        input: { id: transaction.id, ...input },
      });
      if (result.error) return toast.error(result.error.message);
      const msg = payloadErrorMessage(result.data?.updateTransaction.errors);
      if (msg) return toast.error(msg);
      toast.success("Transaction updated");
    } else {
      const result = await createTransaction({ input });
      if (result.error) return toast.error(result.error.message);
      const msg = payloadErrorMessage(result.data?.createTransaction.errors);
      if (msg) return toast.error(msg);
      toast.success("Transaction created");
    }
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit transaction" : "New transaction"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tx-name">Name</Label>
            <Input id="tx-name" placeholder="e.g. Salary" autoFocus {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tx-date">Date</Label>
              <Input id="tx-date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx-amount">Amount</Label>
              <Input
                id="tx-amount"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNCATEGORIZED}>Uncategorized</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
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

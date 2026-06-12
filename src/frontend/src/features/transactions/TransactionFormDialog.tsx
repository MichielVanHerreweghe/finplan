import { useEffect, useState } from "react";
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
import { usePockets } from "@/features/pockets/usePockets";
import { PocketFormDialog } from "@/features/pockets/PocketFormDialog";
import { CategoryFormDialog } from "@/features/categories/CategoryFormDialog";
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

// Sentinel select value that opens an inline create dialog instead of selecting an option.
const CREATE_NEW = "__create__";

// Which pocket endpoints each type requires:
//   INCOME -> to only, EXPENSE -> from only, TRANSFER -> both (distinct).
const schema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    date: z.string().min(1, "Date is required"),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
    // "none" or the category id as a string.
    categoryId: z.string(),
    // "" when not selected, or the pocket id as a string.
    fromPocketId: z.string(),
    toPocketId: z.string(),
  })
  .superRefine((values, ctx) => {
    const needsFrom = values.type === "EXPENSE" || values.type === "TRANSFER";
    const needsTo = values.type === "INCOME" || values.type === "TRANSFER";

    if (needsFrom && !values.fromPocketId) {
      ctx.addIssue({
        path: ["fromPocketId"],
        code: z.ZodIssueCode.custom,
        message: "Source pocket is required",
      });
    }
    if (needsTo && !values.toPocketId) {
      ctx.addIssue({
        path: ["toPocketId"],
        code: z.ZodIssueCode.custom,
        message: "Destination pocket is required",
      });
    }
    if (
      values.type === "TRANSFER" &&
      values.fromPocketId &&
      values.fromPocketId === values.toPocketId
    ) {
      ctx.addIssue({
        path: ["toPocketId"],
        code: z.ZodIssueCode.custom,
        message: "Must differ from the source",
      });
    }
  });

type FormValues = z.input<typeof schema>;

type TransactionTypeValue = "INCOME" | "EXPENSE" | "TRANSFER";

export interface TransactionPreset {
  type?: TransactionTypeValue;
  fromPocketId?: number;
  toPocketId?: number;
  name?: string;
  /** Tags the created transaction as a contribution to this saving goal. */
  savingGoalId?: number;
  /** One-tap amounts shown above the amount field (e.g. a goal's monthly/weekly target). */
  quickAmounts?: { label: string; value: number }[];
}

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: TransactionFieldsFragment;
  /** Prefills a new transaction (e.g. opened from a pocket or saving goal). Ignored when editing. */
  preset?: TransactionPreset;
  onSaved: () => void;
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
  preset,
  onSaved,
}: TransactionFormDialogProps) {
  const isEdit = transaction !== undefined;
  const { categories, refetch: refetchCategories } = useCategories();
  const { pockets, refetch: refetchPockets } = usePockets();
  const [, createTransaction] = useMutation(CreateTransactionMutation);
  const [, updateTransaction] = useMutation(UpdateTransactionMutation);

  // Inline "create new" dialogs launched from the selects. The pocket dialog tracks which
  // field (source/destination) opened it so the new pocket lands in the right one.
  const [pocketDialogFor, setPocketDialogFor] = useState<
    "fromPocketId" | "toPocketId" | null
  >(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      date: todayIso(),
      amount: 0,
      type: "EXPENSE",
      categoryId: UNCATEGORIZED,
      fromPocketId: "",
      toPocketId: "",
    },
  });

  const type = watch("type");
  const showFrom = type === "EXPENSE" || type === "TRANSFER";
  const showTo = type === "INCOME" || type === "TRANSFER";
  const showCategory = type !== "TRANSFER";

  useEffect(() => {
    if (!open) return;
    reset({
      name: transaction?.name ?? preset?.name ?? "",
      date: transaction?.date ?? todayIso(),
      amount: transaction?.amount ?? 0,
      type: transaction
        ? transaction.type === "INCOME" || transaction.type === "TRANSFER"
          ? transaction.type
          : "EXPENSE"
        : (preset?.type ?? "EXPENSE"),
      categoryId:
        transaction?.categoryId != null
          ? String(transaction.categoryId)
          : UNCATEGORIZED,
      fromPocketId:
        transaction?.fromPocketId != null
          ? String(transaction.fromPocketId)
          : preset?.fromPocketId != null
            ? String(preset.fromPocketId)
            : "",
      toPocketId:
        transaction?.toPocketId != null
          ? String(transaction.toPocketId)
          : preset?.toPocketId != null
            ? String(preset.toPocketId)
            : "",
    });
  }, [
    open,
    transaction,
    preset?.type,
    preset?.fromPocketId,
    preset?.toPocketId,
    preset?.name,
    reset,
  ]);

  async function onSubmit(values: FormValues) {
    const parsed = schema.parse(values);
    const isTransfer = parsed.type === "TRANSFER";
    const input = {
      name: parsed.name,
      date: parsed.date,
      amount: parsed.amount,
      type: parsed.type,
      // Transfers are internal moves, never categorized.
      categoryId:
        isTransfer || parsed.categoryId === UNCATEGORIZED
          ? null
          : Number(parsed.categoryId),
      fromPocketId:
        parsed.type === "EXPENSE" || isTransfer
          ? Number(parsed.fromPocketId)
          : null,
      toPocketId:
        parsed.type === "INCOME" || isTransfer
          ? Number(parsed.toPocketId)
          : null,
      // Preserve an existing goal tag on edit; apply the preset's tag on create.
      savingGoalId: transaction
        ? (transaction.savingGoalId ?? null)
        : (preset?.savingGoalId ?? null),
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

          {preset?.quickAmounts?.length ? (
            <div className="flex flex-wrap gap-2">
              {preset.quickAmounts.map((quick) => (
                <Button
                  key={quick.label}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setValue("amount", quick.value, { shouldValidate: true })
                  }
                >
                  {quick.label}
                </Button>
              ))}
            </div>
          ) : null}

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
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {(showFrom || showTo) && (
            <div
              className={showFrom && showTo ? "grid grid-cols-2 gap-4" : undefined}
            >
              {showFrom && (
                <div className="space-y-2">
                  <Label>From pocket</Label>
                  <Controller
                    control={control}
                    name="fromPocketId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          value === CREATE_NEW
                            ? setPocketDialogFor("fromPocketId")
                            : field.onChange(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pocket" />
                        </SelectTrigger>
                        <SelectContent>
                          {pockets.map((pocket) => (
                            <SelectItem key={pocket.id} value={String(pocket.id)}>
                              {pocket.name}
                            </SelectItem>
                          ))}
                          <SelectItem value={CREATE_NEW} className="text-primary">
                            + Create new pocket…
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.fromPocketId && (
                    <p className="text-sm text-destructive">
                      {errors.fromPocketId.message}
                    </p>
                  )}
                </div>
              )}
              {showTo && (
                <div className="space-y-2">
                  <Label>To pocket</Label>
                  <Controller
                    control={control}
                    name="toPocketId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          value === CREATE_NEW
                            ? setPocketDialogFor("toPocketId")
                            : field.onChange(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pocket" />
                        </SelectTrigger>
                        <SelectContent>
                          {pockets.map((pocket) => (
                            <SelectItem key={pocket.id} value={String(pocket.id)}>
                              {pocket.name}
                            </SelectItem>
                          ))}
                          <SelectItem value={CREATE_NEW} className="text-primary">
                            + Create new pocket…
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.toPocketId && (
                    <p className="text-sm text-destructive">
                      {errors.toPocketId.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {showCategory && (
            <div className="space-y-2">
              <Label>Category</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) =>
                      value === CREATE_NEW
                        ? setCategoryDialogOpen(true)
                        : field.onChange(value)
                    }
                  >
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
                      <SelectItem value={CREATE_NEW} className="text-primary">
                        + Create new category…
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

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

        {/* Inline "create new" dialogs; they portal out, so nesting here is fine.
            On save we refresh the list and auto-select the freshly created item. */}
        <PocketFormDialog
          open={pocketDialogFor !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setPocketDialogFor(null);
          }}
          pockets={pockets}
          onSaved={(createdId) => {
            refetchPockets();
            if (createdId != null && pocketDialogFor) {
              setValue(pocketDialogFor, String(createdId), {
                shouldValidate: true,
              });
            }
            setPocketDialogFor(null);
          }}
        />
        <CategoryFormDialog
          open={categoryDialogOpen}
          onOpenChange={setCategoryDialogOpen}
          onSaved={(createdId) => {
            refetchCategories();
            if (createdId != null) {
              setValue("categoryId", String(createdId), {
                shouldValidate: true,
              });
            }
            setCategoryDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

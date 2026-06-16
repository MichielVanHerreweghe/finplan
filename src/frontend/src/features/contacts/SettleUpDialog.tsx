import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "urql";
import { toast } from "sonner";

import { RecordContactSettlementMutation } from "@/graphql/operations";
import { payloadErrorMessage } from "@/lib/graphql-error";
import { todayIso } from "@/lib/format";
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

const schema = z.object({
  // "youPaid" => you paid them; "theyPaid" => they paid you.
  direction: z.enum(["youPaid", "theyPaid"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
});

type FormValues = z.input<typeof schema>;

interface SettleUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: number;
  meId: number;
  otherUserId: number;
  otherLabel: string;
  /** Current net: positive => they owe you; negative => you owe them. */
  net: number;
  onSaved: () => void;
}

export function SettleUpDialog({
  open,
  onOpenChange,
  contactId,
  meId,
  otherUserId,
  otherLabel,
  net,
  onSaved,
}: SettleUpDialogProps) {
  const [, recordSettlement] = useMutation(RecordContactSettlementMutation);

  // Default to whoever owes paying off the balance: net < 0 => you owe => you pay.
  const defaultDirection = net < 0 ? "youPaid" : "theyPaid";

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      direction: defaultDirection,
      amount: Math.abs(net),
      date: todayIso(),
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      direction: net < 0 ? "youPaid" : "theyPaid",
      amount: Math.abs(net),
      date: todayIso(),
    });
  }, [open, net, reset]);

  async function onSubmit(values: FormValues) {
    const parsed = schema.parse(values);
    const fromUserId = parsed.direction === "youPaid" ? meId : otherUserId;
    const toUserId = parsed.direction === "youPaid" ? otherUserId : meId;

    const result = await recordSettlement({
      input: { contactId, amount: parsed.amount, date: parsed.date, fromUserId, toUserId },
    });
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.recordContactSettlement.errors);
    if (msg) return toast.error(msg);
    toast.success("Payment recorded");
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settle up</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Payment</Label>
            <Controller
              control={control}
              name="direction"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youPaid">You paid {otherLabel}</SelectItem>
                    <SelectItem value="theyPaid">{otherLabel} paid you</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="settle-amount">Amount</Label>
            <Input id="settle-amount" type="number" step="0.01" min="0" autoFocus {...register("amount")} />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="settle-date">Date</Label>
            <Input id="settle-date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Record payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

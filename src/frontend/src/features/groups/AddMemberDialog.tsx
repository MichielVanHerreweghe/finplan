import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "urql";
import { toast } from "sonner";

import { AddGroupMemberMutation } from "@/graphql/operations";
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

const schema = z.object({ email: z.string().trim().email("Enter a valid email") });

type FormValues = z.input<typeof schema>;

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
  onSaved: () => void;
}

export function AddMemberDialog({ open, onOpenChange, groupId, onSaved }: AddMemberDialogProps) {
  const [, addMember] = useMutation(AddGroupMemberMutation);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  useEffect(() => {
    if (!open) return;
    reset({ email: "" });
  }, [open, reset]);

  async function onSubmit(values: FormValues) {
    const result = await addMember({ input: { groupId, email: values.email.trim() } });
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.addGroupMember.errors);
    if (msg) return toast.error(msg);
    toast.success("Member added");
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-email">Email</Label>
            <Input
              id="member-email"
              type="email"
              placeholder="name@example.com"
              autoFocus
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              They must have signed in to FinPlan at least once.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "urql";
import { toast } from "sonner";

import { SendInvitationMutation } from "@/graphql/operations";
import { payloadErrorMessage } from "@/lib/graphql-error";
import { useContacts } from "@/features/contacts/useContacts";
import { ContactPicker } from "@/features/contacts/ContactPicker";
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
  const [, sendInvitation] = useMutation(SendInvitationMutation);
  const { contacts } = useContacts();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  useEffect(() => {
    if (!open) return;
    reset({ email: "" });
  }, [open, reset]);

  async function onSubmit(values: FormValues) {
    const result = await sendInvitation({
      input: { type: "GROUP_MEMBER", email: values.email.trim(), targetId: groupId },
    });
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.sendInvitation.errors);
    if (msg) return toast.error(msg);
    toast.success("Request sent");
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {contacts.length > 0 && (
            <ContactPicker
              contacts={contacts}
              onSelect={(email) => setValue("email", email, { shouldValidate: true })}
            />
          )}
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
              They must have signed in to FinPlan at least once, and will need to accept your invite.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

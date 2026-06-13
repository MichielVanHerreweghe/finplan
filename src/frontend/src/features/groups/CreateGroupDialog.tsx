import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "urql";
import { toast } from "sonner";

import { CreateGroupMutation } from "@/graphql/operations";
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
});

type FormValues = z.input<typeof schema>;

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Receives the new group's owner id so the caller can switch into it. */
  onCreated: (ownerId: number) => void;
}

export function CreateGroupDialog({ open, onOpenChange, onCreated }: CreateGroupDialogProps) {
  const [, createGroup] = useMutation(CreateGroupMutation);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({ name: "", description: "" });
  }, [open, reset]);

  async function onSubmit(values: FormValues) {
    const parsed = schema.parse(values);
    const result = await createGroup({
      input: {
        name: parsed.name,
        description: parsed.description?.length ? parsed.description : null,
      },
    });
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.createGroup.errors);
    if (msg) return toast.error(msg);
    toast.success("Group created");
    onOpenChange(false);
    const ownerId = result.data?.createGroup.ownerId;
    if (ownerId != null) onCreated(ownerId);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Name</Label>
            <Input id="group-name" placeholder="e.g. Household" autoFocus {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-description">Description</Label>
            <Input id="group-description" placeholder="Optional" {...register("description")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

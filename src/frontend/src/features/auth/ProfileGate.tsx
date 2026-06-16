import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "urql";
import { toast } from "sonner";

import { CompleteProfileMutation, MeQuery } from "@/graphql/operations";
import { combinedErrorMessage, payloadErrorMessage } from "@/lib/graphql-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Blocks the app on first login until the user has filled in their name. Email and display name
// come from the OIDC token; first/last name are FinPlan-owned and captured here.
export function ProfileGate({ children }: { children: ReactNode }) {
  const [{ data, fetching, error }, refetchMe] = useQuery({ query: MeQuery });

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (error || !data?.me) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center text-sm text-destructive">
        {error ? combinedErrorMessage(error) : "Could not load your profile."}
      </div>
    );
  }

  if (data.me.profileCompleted) {
    return <>{children}</>;
  }

  return <OnboardingForm onCompleted={() => refetchMe({ requestPolicy: "network-only" })} />;
}

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
});

type FormValues = z.input<typeof schema>;

function OnboardingForm({ onCompleted }: { onCompleted: () => void }) {
  const [, completeProfile] = useMutation(CompleteProfileMutation);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "" },
  });

  async function onSubmit(values: FormValues) {
    const result = await completeProfile({
      input: { firstName: values.firstName.trim(), lastName: values.lastName.trim() },
    });
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.completeProfile.errors);
    if (msg) return toast.error(msg);
    toast.success("Welcome to FinPlan!");
    onCompleted();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to FinPlan</h1>
          <p className="text-sm text-muted-foreground">
            Let's finish setting up your profile.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" autoFocus {...register("firstName")} />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" {...register("lastName")} />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}

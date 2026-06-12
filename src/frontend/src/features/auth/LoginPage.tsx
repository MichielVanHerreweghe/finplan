import { useAuth } from "react-oidc-context";
import { Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LoginPage() {
  const auth = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <div className="flex items-center gap-2 text-2xl font-semibold">
        <Wallet className="size-7" />
        FinPlan
      </div>
      <p className="text-sm text-muted-foreground">
        Sign in to access your pockets, transactions and goals.
      </p>
      <Button onClick={() => void auth.signinRedirect()}>Sign in</Button>
      {auth.error && (
        <p className="text-sm text-destructive">{auth.error.message}</p>
      )}
    </div>
  );
}

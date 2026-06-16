import { useAuth } from "react-oidc-context";
import { ArrowRight, PiggyBank, Receipt, Wallet, Wallet2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  { icon: Wallet2, label: "Pockets & balances" },
  { icon: Receipt, label: "Track every transaction" },
  { icon: PiggyBank, label: "Reach saving goals" },
];

export function LoginPage() {
  const auth = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Wallet className="size-7" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">FinPlan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Plan your money — pockets, transactions, goals and shared expenses,
            all in one place.
          </p>
        </div>

        <ul className="mt-6 space-y-2">
          {highlights.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-lg bg-secondary/60 px-3 py-2 text-sm"
            >
              <Icon className="size-4 text-primary" />
              {label}
            </li>
          ))}
        </ul>

        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={() => void auth.signinRedirect()}
        >
          Sign in <ArrowRight />
        </Button>

        {auth.error && (
          <p className="mt-4 text-center text-sm text-destructive">
            {auth.error.message}
          </p>
        )}
      </div>
    </div>
  );
}

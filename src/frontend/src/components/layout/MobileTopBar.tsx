import { Wallet } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { ContextSwitcher } from "@/features/groups/ContextSwitcher";

/** Sticky top bar for mobile: brand, context switcher, theme toggle. */
export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur md:hidden">
      <div className="flex items-center gap-2 font-semibold tracking-tight">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet className="size-4" />
        </span>
        FinPlan
      </div>
      <div className="ml-auto flex items-center gap-1">
        <div className="w-40">
          <ContextSwitcher />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

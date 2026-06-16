import { NavLink } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { LogOut, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ContextSwitcher } from "@/features/groups/ContextSwitcher";
import { navItems } from "./nav";

/** Desktop navigation rail (hidden below `md`). */
export function Sidebar() {
  const auth = useAuth();
  const profile = auth.user?.profile;
  const userLabel = profile?.name ?? profile?.email ?? "Account";

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
      <div className="flex h-16 items-center gap-2 px-6 text-lg font-semibold tracking-tight">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet className="size-5" />
        </span>
        FinPlan
      </div>
      <div className="px-3 pb-3">
        <ContextSwitcher />
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-3">
        <div className="flex items-center justify-between gap-2 px-1">
          <div
            className="min-w-0 flex-1 truncate text-xs text-muted-foreground"
            title={userLabel}
          >
            {userLabel}
          </div>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="mt-1 w-full justify-start text-muted-foreground"
          onClick={() => void auth.removeUser()}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}

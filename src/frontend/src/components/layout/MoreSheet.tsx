import { NavLink } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { secondaryNavItems } from "./nav";

interface MoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Bottom sheet holding the navigation items that don't fit the tab bar. */
export function MoreSheet({ open, onOpenChange }: MoreSheetProps) {
  const auth = useAuth();
  const profile = auth.user?.profile;
  const userLabel = profile?.name ?? profile?.email ?? "Account";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-border" />
        <SheetTitle className="px-1 pt-3">More</SheetTitle>
        <nav className="grid grid-cols-2 gap-2 pb-2 pt-3">
          {secondaryNavItems.map(({ to, label, icon: Icon }) => (
            <SheetClose asChild key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-start gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "hover:bg-secondary",
                  )
                }
              >
                <Icon className="size-5" />
                {label}
              </NavLink>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-2 flex items-center justify-between gap-2 border-t pt-4">
          <span className="min-w-0 truncate text-sm text-muted-foreground" title={userLabel}>
            {userLabel}
          </span>
          <button
            type="button"
            onClick={() => void auth.removeUser()}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

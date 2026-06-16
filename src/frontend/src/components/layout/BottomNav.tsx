import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { MoreSheet } from "./MoreSheet";
import { primaryNavItems, secondaryNavItems } from "./nav";

const itemClass =
  "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors";

/** Fixed mobile tab bar (hidden at `md`+). 3 primary tabs + a "More" sheet. */
export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const moreActive = secondaryNavItems.some((item) =>
    location.pathname.startsWith(item.to),
  );

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {primaryNavItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(itemClass, isActive ? "text-primary" : "text-muted-foreground")
            }
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={cn(
            itemClass,
            moreActive || moreOpen ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Menu className="size-5" />
          More
        </button>
      </nav>
      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  );
}

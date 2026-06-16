import {
  ArrowLeftRight,
  Contact,
  Inbox,
  LayoutDashboard,
  PiggyBank,
  Receipt,
  Tags,
  Users,
  Wallet2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

/** Full navigation, in sidebar order. */
export const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/pockets", label: "Pockets", icon: Wallet2 },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/saving-goals", label: "Saving Goals", icon: PiggyBank },
  { to: "/activities", label: "Activities", icon: Receipt },
  { to: "/groups", label: "Groups", icon: Users },
  { to: "/contacts", label: "Contacts", icon: Contact },
  { to: "/requests", label: "Requests", icon: Inbox },
];

/** Primary destinations shown directly in the mobile bottom bar. */
export const primaryNavItems: NavItem[] = navItems.slice(0, 3);

/** Remaining destinations, surfaced via the "More" sheet on mobile. */
export const secondaryNavItems: NavItem[] = navItems.slice(3);

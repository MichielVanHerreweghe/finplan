import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import {
  ArrowLeftRight,
  LayoutDashboard,
  PiggyBank,
  Tags,
  Wallet,
  Wallet2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { TransactionsPage } from "@/features/transactions/TransactionsPage";
import { CategoriesPage } from "@/features/categories/CategoriesPage";
import { SavingGoalsPage } from "@/features/savingGoals/SavingGoalsPage";
import { PocketsPage } from "@/features/pockets/PocketsPage";
import { PocketDetailPage } from "@/features/pockets/PocketDetailPage";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/pockets", label: "Pockets", icon: Wallet2 },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/saving-goals", label: "Saving Goals", icon: PiggyBank },
];

export function App() {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-60 shrink-0 flex-col border-r">
        <div className="flex h-14 items-center gap-2 border-b px-6 font-semibold">
          <Wallet className="size-5" />
          FinPlan
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-4xl px-8 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/pockets" element={<PocketsPage />} />
            <Route path="/pockets/:id" element={<PocketDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/saving-goals" element={<SavingGoalsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

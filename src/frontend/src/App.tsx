import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { TransactionsPage } from "@/features/transactions/TransactionsPage";
import { CategoriesPage } from "@/features/categories/CategoriesPage";
import { SavingGoalsPage } from "@/features/savingGoals/SavingGoalsPage";
import { PocketsPage } from "@/features/pockets/PocketsPage";
import { PocketDetailPage } from "@/features/pockets/PocketDetailPage";
import { ActivitiesPage } from "@/features/activities/ActivitiesPage";
import { ActivityDetailPage } from "@/features/activities/ActivityDetailPage";
import { GroupsPage } from "@/features/groups/GroupsPage";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { CallbackPage } from "@/features/auth/CallbackPage";

export function App() {
  return (
    <Routes>
      <Route path="/auth/callback" element={<CallbackPage />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/pockets" element={<PocketsPage />} />
        <Route path="/pockets/:id" element={<PocketDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/saving-goals" element={<SavingGoalsPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/activities/:id" element={<ActivityDetailPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

import type { ReactNode } from "react";
import { useAuth } from "react-oidc-context";

import { LoginPage } from "@/features/auth/LoginPage";

// Gates the app behind authentication: shows a loading state while OIDC resolves the session,
// the login screen when signed out, and the protected content once authenticated.
export function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

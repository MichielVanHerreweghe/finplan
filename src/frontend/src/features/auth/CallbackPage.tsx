import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

// The OIDC redirect_uri target. AuthProvider processes the authorization code in the URL;
// once the session is established we replace this route with the dashboard.
export function CallbackPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate("/", { replace: true });
  }, [auth.isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      {auth.error ? `Sign-in failed: ${auth.error.message}` : "Completing sign-in…"}
    </div>
  );
}

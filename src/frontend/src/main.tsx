import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as UrqlProvider } from "urql";
import { AuthProvider } from "react-oidc-context";

import { App } from "@/App";
import { urqlClient } from "@/lib/urql";
import { userManager } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider userManager={userManager}>
      <UrqlProvider value={urqlClient}>
        <BrowserRouter>
          <App />
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </UrqlProvider>
    </AuthProvider>
  </StrictMode>,
);

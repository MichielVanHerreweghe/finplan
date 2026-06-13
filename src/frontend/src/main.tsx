import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";

import { App } from "@/App";
import { OwnerContextProvider } from "@/features/groups/OwnerContext";
import { userManager } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider userManager={userManager}>
      <OwnerContextProvider>
        <BrowserRouter>
          <App />
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </OwnerContextProvider>
    </AuthProvider>
  </StrictMode>,
);

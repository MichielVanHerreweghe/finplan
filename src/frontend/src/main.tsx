import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as UrqlProvider } from "urql";

import { App } from "@/App";
import { urqlClient } from "@/lib/urql";
import { Toaster } from "@/components/ui/sonner";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UrqlProvider value={urqlClient}>
      <BrowserRouter>
        <App />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </UrqlProvider>
  </StrictMode>,
);

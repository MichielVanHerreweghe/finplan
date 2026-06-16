import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Provider as UrqlProvider, useQuery } from "urql";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

import { createUrqlClient } from "@/lib/urql";
import { MyContextsQuery } from "@/graphql/operations";

const STORAGE_KEY = "finplan.activeOwnerId";

export interface OwnerContextOption {
  ownerId: number;
  kind: string; // "PERSONAL" | "GROUP"
  name: string;
}

interface OwnerContextValue {
  /** null = Personal (no header). A number = act as that owner. */
  activeOwnerId: number | null;
  setActiveOwner: (ownerId: number | null) => void;
  contexts: OwnerContextOption[];
  fetching: boolean;
  refetchContexts: () => void;
}

const OwnerContext = createContext<OwnerContextValue | null>(null);

export function useOwnerContext(): OwnerContextValue {
  const value = useContext(OwnerContext);
  if (!value) throw new Error("useOwnerContext must be used within OwnerContextProvider");
  return value;
}

function readStored(): number | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

// Holds the active owner context, builds a context-bound urql client (recreated on switch so
// caches never bleed), and exposes the list of contexts the user can switch between.
export function OwnerContextProvider({ children }: { children: ReactNode }) {
  const [activeOwnerId, setActiveOwnerIdState] = useState<number | null>(readStored);

  const setActiveOwner = useCallback((ownerId: number | null) => {
    if (ownerId == null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, String(ownerId));
    setActiveOwnerIdState(ownerId);
  }, []);

  const handleContextDenied = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setActiveOwnerIdState((current) => {
      if (current !== null) toast.error("That context is no longer available — switched to Personal.");
      return null;
    });
  }, []);

  const client = useMemo(
    () => createUrqlClient(activeOwnerId, handleContextDenied),
    [activeOwnerId, handleContextDenied],
  );

  return (
    <UrqlProvider value={client}>
      <ContextsInner activeOwnerId={activeOwnerId} setActiveOwner={setActiveOwner}>
        {children}
      </ContextsInner>
    </UrqlProvider>
  );
}

function ContextsInner({
  activeOwnerId,
  setActiveOwner,
  children,
}: {
  activeOwnerId: number | null;
  setActiveOwner: (ownerId: number | null) => void;
  children: ReactNode;
}) {
  // Only load contexts once authenticated; the provider sits outside the auth gate.
  const auth = useAuth();
  const [{ data, fetching }, reexecute] = useQuery({
    query: MyContextsQuery,
    pause: !auth.isAuthenticated,
  });

  const value = useMemo<OwnerContextValue>(
    () => ({
      activeOwnerId,
      setActiveOwner,
      contexts: data?.myContexts ?? [],
      fetching,
      refetchContexts: () => reexecute({ requestPolicy: "network-only" }),
    }),
    [activeOwnerId, setActiveOwner, data, fetching, reexecute],
  );

  return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>;
}

import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOwnerContext } from "./OwnerContext";

// Sentinel value: opens the groups management page instead of selecting a context.
const MANAGE = "__manage__";

// Workspace-style switcher between the user's Personal context and their groups. Selecting a
// context rebuilds the urql client (see OwnerContextProvider), so the whole app refetches the
// chosen owner's data.
export function ContextSwitcher() {
  const { activeOwnerId, setActiveOwner, contexts } = useOwnerContext();
  const navigate = useNavigate();

  const personal = contexts.find((context) => context.kind === "PERSONAL");
  // Personal is represented as activeOwnerId === null (no header); show it selected via its id.
  const currentValue =
    activeOwnerId != null
      ? String(activeOwnerId)
      : personal
        ? String(personal.ownerId)
        : "";

  function onChange(value: string) {
    if (value === MANAGE) {
      navigate("/groups");
      return;
    }
    const ownerId = Number(value);
    setActiveOwner(personal && ownerId === personal.ownerId ? null : ownerId);
  }

  return (
    <Select value={currentValue} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Personal" />
      </SelectTrigger>
      <SelectContent>
        {contexts.map((context) => (
          <SelectItem key={context.ownerId} value={String(context.ownerId)}>
            {context.name}
          </SelectItem>
        ))}
        <SelectItem value={MANAGE} className="text-primary">
          Manage groups…
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

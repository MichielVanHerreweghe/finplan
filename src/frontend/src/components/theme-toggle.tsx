import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

const NEXT_LABEL: Record<string, string> = {
  light: "Switch to dark theme",
  dark: "Switch to system theme",
  system: "Switch to light theme",
};

/** Cycles light → dark → system. Icon reflects the current setting. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={NEXT_LABEL[theme]}
      title={NEXT_LABEL[theme]}
      className={className}
    >
      <Icon />
    </Button>
  );
}

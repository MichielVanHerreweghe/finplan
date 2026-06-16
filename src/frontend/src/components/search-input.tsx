import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchInputProps {
  /** Current committed value (debounced result lives in the parent). */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Debounce in ms before firing onChange. */
  delay?: number;
  className?: string;
}

/**
 * Debounced search box. Keeps its own immediate text state for responsiveness
 * and pushes the trimmed value up after `delay` ms so callers can drive a
 * server-side query without a request per keystroke.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  delay = 300,
  className,
}: SearchInputProps) {
  const [text, setText] = useState(value);

  // Keep local text in sync if the parent resets the value externally.
  useEffect(() => setText(value), [value]);

  useEffect(() => {
    if (text === value) return;
    const id = setTimeout(() => onChange(text), delay);
    return () => clearTimeout(id);
  }, [text, value, delay, onChange]);

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-9 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-9 md:text-sm [&::-webkit-search-cancel-button]:appearance-none"
      />
      {text && (
        <button
          type="button"
          onClick={() => setText("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

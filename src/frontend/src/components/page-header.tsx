import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Optional action(s), e.g. a primary button. Stacks full-width on mobile. */
  action?: ReactNode;
  className?: string;
}

/**
 * Standard page title block. The action sits beside the title on `sm+` and
 * drops below it (full-width) on mobile so buttons never crowd the heading.
 */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 flex-wrap gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
          {action}
        </div>
      )}
    </div>
  );
}

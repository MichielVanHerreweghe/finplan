import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/features/categories/useCategories";
import {
  ALL,
  UNCATEGORIZED,
  defaultFilters,
  isFilterActive,
  type DashboardFilters as Filters,
} from "./filters";

interface DashboardFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function DashboardFilters({ filters, onChange }: DashboardFiltersProps) {
  const { categories } = useCategories();
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <Label htmlFor="filter-type">Type</Label>
        <Select value={filters.type} onValueChange={(v) => set({ type: v })}>
          <SelectTrigger id="filter-type" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-category">Category</Label>
        <Select
          value={filters.categoryId}
          onValueChange={(v) => set({ categoryId: v })}
        >
          <SelectTrigger id="filter-category" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All categories</SelectItem>
            <SelectItem value={UNCATEGORIZED}>Uncategorized</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isFilterActive(filters) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(defaultFilters)}
        >
          <X /> Clear
        </Button>
      )}
    </div>
  );
}

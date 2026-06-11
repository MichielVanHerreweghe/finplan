import {
  formatDate,
  formatDayShort,
  formatMonthAbbr,
  formatMonthLong,
  formatWeekday,
} from "@/lib/format";

// A period overview scopes the whole dashboard to a single day/week/month/year,
// navigable backwards and forwards. The "cash flow" chart breaks the period into
// its sub-units: days (for day/week/month) or months (for year).

export type PeriodUnit = "day" | "week" | "month" | "year";

export const PERIOD_UNITS: { value: PeriodUnit; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export interface PeriodRange {
  start: string; // inclusive yyyy-MM-dd
  end: string; // inclusive yyyy-MM-dd
}

export interface Bucket {
  key: string; // matches stats.periodKey for the sub-granularity
  label: string;
}

function parse(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function fmt(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

/** The chart's sub-bucket granularity for a period unit. */
export function subGranularity(unit: PeriodUnit): "day" | "month" {
  return unit === "year" ? "month" : "day";
}

/** Inclusive date range covered by the period the anchor falls in. */
export function periodRange(unit: PeriodUnit, anchor: string): PeriodRange {
  const d = parse(anchor);
  switch (unit) {
    case "day":
      return { start: anchor, end: anchor };
    case "week": {
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return { start: fmt(monday), end: fmt(sunday) };
    }
    case "month": {
      const first = new Date(d.getFullYear(), d.getMonth(), 1);
      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      return { start: fmt(first), end: fmt(last) };
    }
    case "year":
      return { start: `${d.getFullYear()}-01-01`, end: `${d.getFullYear()}-12-31` };
  }
}

/** Moves the anchor by `delta` whole periods (e.g. previous/next week). */
export function shiftPeriod(
  unit: PeriodUnit,
  anchor: string,
  delta: number,
): string {
  const d = parse(anchor);
  switch (unit) {
    case "day":
      d.setDate(d.getDate() + delta);
      break;
    case "week":
      d.setDate(d.getDate() + delta * 7);
      break;
    case "month":
      d.setMonth(d.getMonth() + delta);
      break;
    case "year":
      d.setFullYear(d.getFullYear() + delta);
      break;
  }
  return fmt(d);
}

/** Human label for the current period, e.g. "June 2026" or "08 Jun – 14 Jun". */
export function periodLabel(unit: PeriodUnit, anchor: string): string {
  switch (unit) {
    case "day":
      return formatDate(anchor);
    case "week": {
      const { start, end } = periodRange(unit, anchor);
      return `${formatDayShort(start)} – ${formatDayShort(end)}`;
    }
    case "month":
      return formatMonthLong(anchor);
    case "year":
      return anchor.slice(0, 4);
  }
}

/** The ordered, zero-fillable sub-buckets that make up the period. */
export function periodBuckets(unit: PeriodUnit, anchor: string): Bucket[] {
  if (unit === "year") {
    const year = anchor.slice(0, 4);
    return Array.from({ length: 12 }, (_, i) => {
      const key = `${year}-${String(i + 1).padStart(2, "0")}`;
      return { key, label: formatMonthAbbr(key) };
    });
  }

  const { start, end } = periodRange(unit, anchor);
  const endDate = parse(end);
  const buckets: Bucket[] = [];
  for (let d = parse(start); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = fmt(d);
    const label =
      unit === "week"
        ? formatWeekday(key)
        : unit === "month"
          ? String(d.getDate())
          : formatDayShort(key);
    buckets.push({ key, label });
  }
  return buckets;
}

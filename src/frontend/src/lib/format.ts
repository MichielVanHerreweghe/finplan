// Display formatting helpers. Amounts are plain numbers (Decimal scalar) and
// dates are ISO `yyyy-MM-dd` strings (LocalDate scalar) from the API.

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

export function formatDate(isoDate: string): string {
  // Parse as a local date without timezone shifting.
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return dateFormatter.format(new Date(year, month - 1, day));
}

const dayShortFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
});

/** Formats a `yyyy-MM-dd` date as e.g. "11 Jun". */
export function formatDayShort(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return dayShortFormatter.format(new Date(year, month - 1, day));
}

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "2-digit",
});

/** Formats a `yyyy-MM` month key as e.g. "Jun 26". */
export function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  if (!year || !month) return monthKey;
  return monthFormatter.format(new Date(year, month - 1, 1));
}

const monthAbbrFormatter = new Intl.DateTimeFormat("en-GB", { month: "short" });

/** Formats a `yyyy-MM` month key as e.g. "Jun". */
export function formatMonthAbbr(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  if (!year || !month) return monthKey;
  return monthAbbrFormatter.format(new Date(year, month - 1, 1));
}

const monthLongFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});

/** Formats an ISO date as e.g. "June 2026". */
export function formatMonthLong(isoDate: string): string {
  const [year, month] = isoDate.split("-").map(Number);
  if (!year || !month) return isoDate;
  return monthLongFormatter.format(new Date(year, month - 1, 1));
}

const weekdayFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short" });

/** Formats a `yyyy-MM-dd` date as a short weekday, e.g. "Mon". */
export function formatWeekday(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return weekdayFormatter.format(new Date(year, month - 1, day));
}

/** Today's date as an ISO `yyyy-MM-dd` string, for form defaults. */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

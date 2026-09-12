const numberFormatter = new Intl.NumberFormat("fa-IR");
const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
const dateTimeFormatter = new Intl.DateTimeFormat("fa-IR", {
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** Formats a number with Persian digits. */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Formats an ISO date string as a Persian date (month and day names localized). */
export function formatDate(isoDate: string | null): string {
  if (isoDate === null) {
    return "—";
  }

  return dateFormatter.format(new Date(isoDate));
}

/** Formats an ISO date string as a Persian date including the time. */
export function formatDateTime(isoDate: string | null): string {
  if (isoDate === null) {
    return "—";
  }

  return dateTimeFormatter.format(new Date(isoDate));
}

/** True when the task is open and its due date has already passed. */
export function isOverdue(dueDateUtc: string | null, done: boolean): boolean {
  if (dueDateUtc === null || done) {
    return false;
  }

  return new Date(dueDateUtc).getTime() < Date.now();
}

/** Converts a local date input value (`yyyy-mm-dd`) to an ISO UTC string. */
export function dateInputToUtcIso(value: string): string | undefined {
  if (value === "") {
    return undefined;
  }

  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Converts an ISO UTC string to a date input value (`yyyy-mm-dd`). */
export function utcIsoToDateInput(isoDate: string | null): string {
  if (isoDate === null) {
    return "";
  }

  return new Date(isoDate).toISOString().slice(0, 10);
}

/** Formats an API date (YYYY-MM-DD) or timestamp; returns undefined when the value is missing or invalid. */
export function formatApiDate(value: string | null | undefined, locale: string): string | undefined {
  if (!value) return undefined
  const dateOnly = value.length === 10
  const date = new Date(dateOnly ? `${value}T00:00:00Z` : value)
  if (Number.isNaN(date.getTime())) return undefined
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: dateOnly ? 'UTC' : undefined }).format(date)
}

/** True only for a calendar date that exists, written as YYYY-MM-DD (2026-02-30 is refused). */
export function isRealIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

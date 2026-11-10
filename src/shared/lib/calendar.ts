export interface CalendarCell {
  /** The date as YYYY-MM-DD. */
  iso: string
  day: number
  inMonth: boolean
}

const dayMs = 24 * 60 * 60 * 1000

function isoOf(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10)
}

/** Today in the device's calendar as YYYY-MM-DD (not the UTC date, which can be a day off). */
export function todayIso(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** The weeks of a month, Monday first, padded with the days of the neighbouring months. `month` is 0-11. */
export function buildMonth(year: number, month: number): CalendarCell[][] {
  const first = Date.UTC(year, month, 1)
  const offset = (new Date(first).getUTCDay() + 6) % 7
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const weeks = Math.ceil((offset + daysInMonth) / 7)
  const start = first - offset * dayMs
  return Array.from({ length: weeks }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const timestamp = start + (week * 7 + weekday) * dayMs
      const date = new Date(timestamp)
      return { iso: isoOf(timestamp), day: date.getUTCDate(), inMonth: date.getUTCMonth() === month }
    })
  )
}

export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const date = new Date(Date.UTC(year, month + delta, 1))
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() }
}

export function isDateAllowed(iso: string, min?: string, max?: string) {
  return (!min || iso >= min) && (!max || iso <= max)
}

import { buildMonth, isDateAllowed, shiftMonth, todayIso } from './calendar'

test('lays out a month Monday first with the neighbouring days around it', () => {
  const weeks = buildMonth(2026, 10) // November 2026 starts on a Sunday
  expect(weeks[0][0].iso).toBe('2026-10-26')
  expect(weeks[0][6]).toEqual({ iso: '2026-11-01', day: 1, inMonth: true })
  expect(weeks.every((week) => week.length === 7)).toBe(true)
  expect(weeks.flat().filter((cell) => cell.inMonth)).toHaveLength(30)
})

test('uses only as many weeks as the month needs', () => {
  expect(buildMonth(2027, 1)).toHaveLength(4) // February 2027 starts on a Monday and has 28 days
  expect(buildMonth(2026, 1)).toHaveLength(5) // February 2026 starts on a Sunday
})

test('moves between months across a year boundary', () => {
  expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 })
  expect(shiftMonth(2026, 0, -1)).toEqual({ year: 2025, month: 11 })
})

test('restricts dates to a range that may be open at either end', () => {
  expect(isDateAllowed('2026-11-10', '2026-11-10', '2026-12-31')).toBe(true)
  expect(isDateAllowed('2026-11-09', '2026-11-10')).toBe(false)
  expect(isDateAllowed('2027-01-01', undefined, '2026-12-31')).toBe(false)
  expect(isDateAllowed('2030-01-01')).toBe(true)
})

test('reads today from the device calendar', () => {
  expect(todayIso(new Date(2026, 10, 9, 23, 59))).toBe('2026-11-09')
})

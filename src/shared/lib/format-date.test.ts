import { formatApiDate, isRealIsoDate } from './format-date'

test('accepts only calendar dates that exist', () => {
  expect(isRealIsoDate('2026-12-31')).toBe(true)
  expect(isRealIsoDate('2028-02-29')).toBe(true)
  expect(isRealIsoDate('2026-02-30')).toBe(false)
  expect(isRealIsoDate('2026-2-3')).toBe(false)
  expect(isRealIsoDate('')).toBe(false)
})

test('formats dates and timestamps, and returns nothing for bad input', () => {
  expect(formatApiDate('2026-11-09', 'en')).toContain('2026')
  expect(formatApiDate('2026-11-09T10:00:00Z', 'en')).toContain('2026')
  expect(formatApiDate('nope', 'en')).toBeUndefined()
  expect(formatApiDate(null, 'en')).toBeUndefined()
})

import { clampPage } from './clamp-page'

test('moves back when the current page no longer exists', () => {
  expect(clampPage(2, 1)).toBe(1)
  expect(clampPage(3, 2)).toBe(2)
})

test('leaves valid or unknown pages alone', () => {
  expect(clampPage(1, 1)).toBe(1)
  expect(clampPage(2, 5)).toBe(2)
  expect(clampPage(2, undefined)).toBe(2)
  expect(clampPage(2, 0)).toBe(2)
})

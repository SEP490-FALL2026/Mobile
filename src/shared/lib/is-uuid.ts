const uuid = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i

// Route params arrive as unknown strings; only a well-formed UUID may reach a screen that loads data by ID.
export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && uuid.test(value)
}

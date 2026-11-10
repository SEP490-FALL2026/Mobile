import axios from 'axios'

/** HTTP status of a failed API call (Axios error), or undefined for network and non-HTTP failures. */
export function httpStatusOf(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) return error.response?.status
  if (typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number') {
    return error.status
  }
  return undefined
}

/** Backend error code (for example `SPEND.STEP_NOT_PENDING`) from the error envelope, if present. */
export function apiErrorCodeOf(error: unknown): string | undefined {
  const body = axios.isAxiosError(error) ? error.response?.data : undefined
  const code = (body as { error?: { code?: unknown } } | undefined)?.error?.code
  return typeof code === 'string' ? code : undefined
}

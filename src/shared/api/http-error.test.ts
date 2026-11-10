import { AxiosError } from 'axios'

import { apiErrorCodeOf, httpStatusOf } from './http-error'

function failure(status: number, code?: string) {
  return new AxiosError('failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: {} } as never,
    data: code ? { success: false, error: { code } } : undefined
  })
}

test('reads the status and error code from an Axios failure', () => {
  expect(httpStatusOf(failure(409, 'SPEND.STEP_NOT_PENDING'))).toBe(409)
  expect(apiErrorCodeOf(failure(409, 'SPEND.STEP_NOT_PENDING'))).toBe('SPEND.STEP_NOT_PENDING')
  expect(apiErrorCodeOf(failure(500))).toBeUndefined()
})

test('has no status for network or unknown failures', () => {
  expect(httpStatusOf(new Error('offline'))).toBeUndefined()
  expect(httpStatusOf(null)).toBeUndefined()
  expect(apiErrorCodeOf(new Error('offline'))).toBeUndefined()
})

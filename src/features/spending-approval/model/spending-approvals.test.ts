import { AxiosError } from 'axios'

import { decisionErrorKey, formatMoney, outcomeTone } from './spending-approvals'

function apiFailure(status: number, code: string) {
  return new AxiosError('failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: {} } as never,
    data: { success: false, error: { code } }
  })
}

describe('spending approval model', () => {
  test('formats only well-formed money', () => {
    expect(formatMoney({ amount: '8400000', currency: 'VND' }, 'en')).toContain('8,400,000')
    expect(formatMoney({ amount: 'abc', currency: 'VND' }, 'en')).toBeUndefined()
    expect(formatMoney({ amount: '10', currency: 'vnd' }, 'en')).toBeUndefined()
    expect(formatMoney(null, 'en')).toBeUndefined()
  })

  test('classifies budget outcomes', () => {
    expect(outcomeTone('WITHIN_BASE')).toBe('success')
    expect(outcomeTone('USES_RESERVE')).toBe('warning')
    expect(outcomeTone('BLOCKED')).toBe('danger')
    expect(outcomeTone(null)).toBe('neutral')
  })

  test('maps server error codes to decision messages', () => {
    const failure = (code: string, status = 409) => apiFailure(status, code)
    expect(decisionErrorKey(failure('SPEND.STEP_NOT_PENDING'))).toBe('stale')
    expect(decisionErrorKey(failure('SPEND.RECHECKED_NEEDS_FINANCE_REVIEW'))).toBe('recheck')
    expect(decisionErrorKey(failure('SPEND.RECHECKED_RETURNED_TO_REQUESTER'))).toBe('recheck')
    expect(decisionErrorKey(failure('SPEND.OWN_REQUEST', 403))).toBe('forbidden')
    expect(decisionErrorKey(failure('SPEND.NOT_THE_ASSIGNEE', 403))).toBe('forbidden')
    expect(decisionErrorKey(failure('VALIDATION_ERROR', 422))).toBe('invalid')
    expect(decisionErrorKey(new Error('network'))).toBe('uncertain')
  })
})

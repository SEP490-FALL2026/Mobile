// Pure helpers for the Manager need decision: server refusals and price display.
export function policyVersionChanged(error: unknown) {
  if (typeof error !== 'object' || error === null || !('status' in error) || error.status !== 409 || !('info' in error))
    return false
  const info = error.info
  if (typeof info !== 'object' || info === null || !('error' in info)) return false
  const detail = info.error
  return typeof detail === 'object' && detail !== null && 'code' in detail && detail.code === 'POLICY.VERSION_CHANGED'
}

export function decisionRefusal(error: unknown) {
  if (typeof error !== 'object' || error === null || !('status' in error) || !('info' in error)) return undefined
  const info = error.info
  if (typeof info !== 'object' || info === null || !('error' in info)) return undefined
  const detail = info.error
  if (typeof detail !== 'object' || detail === null || !('code' in detail)) return undefined
  if (error.status === 409 && detail.code === 'ACCESS_REQUEST.STEP_NOT_PENDING') return 'stale'
  if (
    error.status === 403 &&
    (detail.code === 'ACCESS_REQUEST.NOT_THE_ASSIGNEE' || detail.code === 'ACCESS_REQUEST.OWN_REQUEST')
  )
    return 'notAssigned'
  return undefined
}

export function formatCost(value: { amount: string; currency: string } | null, locale: string) {
  if (!value || !/^[A-Z]{3}$/.test(value.currency) || !/^\d{1,12}(\.\d{1,2})?$/.test(value.amount)) return undefined
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: value.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(value.amount))
}

interface NeedRequestState {
  id: string
  type: string
  needStep: { id: string; state: string }
  needDecision: unknown
}

// The assigned step is still open on the request the server returned: same request, same step, still pending, and
// (for a single person) not decided yet. A group stays open while anyone in it waits.
export function isOpenNeedStep(request: NeedRequestState, item: { requestId: string; stepId: string }) {
  if (request.id !== item.requestId || request.needStep.id !== item.stepId || request.needStep.state !== 'PENDING')
    return false
  if (request.type === 'GROUP_GRANT') return true
  return (request.type === 'GRANT' || request.type === 'RENEWAL') && !request.needDecision
}

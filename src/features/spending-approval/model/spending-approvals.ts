import { apiErrorCodeOf, httpStatusOf } from '@/shared/api/http-error'

export interface Money {
  amount: string
  currency: string
}

export type Tone = 'success' | 'warning' | 'danger' | 'neutral'

export const maxReasonLength = 1000

export function formatMoney(value: Money | null | undefined, locale: string): string | undefined {
  if (!value || !/^[A-Z]{3}$/.test(value.currency) || !/^-?\d{1,12}(\.\d{1,4})?$/.test(value.amount)) return undefined
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: value.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(value.amount))
}

export function formatDate(value: string | null | undefined, locale: string): string | undefined {
  if (!value) return undefined
  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value)
  if (Number.isNaN(date.getTime())) return undefined
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: value.length === 10 ? 'UTC' : undefined
  }).format(date)
}

export function initialsOf(name: string) {
  return name.trim().slice(0, 1).toLocaleUpperCase()
}

export type BudgetOutcome = 'WITHIN_BASE' | 'USES_RESERVE' | 'BLOCKED'

export function outcomeTone(outcome: BudgetOutcome | null | undefined): Tone {
  if (outcome === 'WITHIN_BASE') return 'success'
  if (outcome === 'USES_RESERVE') return 'warning'
  if (outcome === 'BLOCKED') return 'danger'
  return 'neutral'
}

export type DecisionErrorKey = 'stale' | 'recheck' | 'sod' | 'forbidden' | 'invalid' | 'uncertain'

export function decisionErrorKey(failure: unknown): DecisionErrorKey {
  const code = apiErrorCodeOf(failure)
  const status = httpStatusOf(failure)
  if (code === 'SPEND.STEP_NOT_PENDING' || code === 'SPEND.NO_SPEND_STEP') return 'stale'
  if (code?.startsWith('SPEND.RECHECKED') || code === 'SPEND.NOT_CHECKABLE') return 'recheck'
  if (code === 'SPEND.OWN_REQUEST' || code === 'SPEND.NOT_THE_ASSIGNEE') return 'forbidden'
  if (code === 'SPEND.REVIEWER_IS_APPROVER') return 'sod'
  if (status === 422) return 'invalid'
  return 'uncertain'
}

import { buildRequestProgress, type ProgressInput } from './request-progress'

const base: ProgressInput = {
  state: 'PENDING',
  hasSpendStep: true,
  needState: 'PENDING',
  needDecision: null,
  needWaitingReason: null,
  spendStage: null
}
const status = (input: Partial<ProgressInput>) =>
  Object.fromEntries(buildRequestProgress({ ...base, ...input }).map((step) => [step.key, step.status]))

describe('request progress', () => {
  test('a new paid request waits for the need decision', () => {
    expect(status({})).toEqual({ submitted: 'done', need: 'current', spend: 'pending', execution: 'pending' })
  })

  test('an approved need moves to the spend decision', () => {
    expect(status({ state: 'AWAITING_SPEND_DECISION', needState: 'APPROVED', needDecision: 'APPROVED' })).toEqual({
      submitted: 'done',
      need: 'done',
      spend: 'current',
      execution: 'pending'
    })
  })

  test('a rejected need ends the later steps', () => {
    expect(status({ state: 'REJECTED', needState: 'REJECTED', needDecision: 'REJECTED' })).toEqual({
      submitted: 'done',
      need: 'failed',
      spend: 'skipped',
      execution: 'skipped'
    })
  })

  test('a free request has no spend step and can complete', () => {
    const steps = buildRequestProgress({
      ...base,
      hasSpendStep: false,
      state: 'COMPLETED',
      needState: 'APPROVED',
      needDecision: 'APPROVED'
    })
    expect(steps.map((step) => step.key)).toEqual(['submitted', 'need', 'execution'])
    expect(steps.at(-1)?.status).toBe('done')
  })

  test('notes explain a step that waits for somebody', () => {
    const steps = buildRequestProgress({ ...base, needState: 'WAITING', needWaitingReason: 'NO_SPENDING_APPROVER' })
    expect(steps[1]).toEqual({ key: 'need', status: 'current', note: 'noSpendingApprover' })
  })

  test('a withdrawn request is closed everywhere that was not done', () => {
    expect(status({ state: 'WITHDRAWN' })).toEqual({
      submitted: 'done',
      need: 'skipped',
      spend: 'skipped',
      execution: 'skipped'
    })
  })

  test('a head request skips the need step and goes straight to the spend decision', () => {
    const steps = buildRequestProgress({
      ...base,
      state: 'AWAITING_SPEND_DECISION',
      needState: 'NOT_REQUIRED',
      spendStage: 'WAITING_SPEND_DECISION'
    })
    expect(steps.map((step) => [step.key, step.status, step.note])).toEqual([
      ['submitted', 'done', undefined],
      ['need', 'skipped', 'notRequired'],
      ['spend', 'current', undefined],
      ['execution', 'pending', undefined]
    ])
  })

  test('a request sent back for changes waits on the requester at the spend step', () => {
    const steps = buildRequestProgress({
      ...base,
      state: 'AWAITING_REQUESTER_REVISION',
      needState: 'APPROVED',
      needDecision: 'APPROVED',
      spendStage: 'RETURNED_TO_REQUESTER'
    })
    expect(steps[2]).toEqual({ key: 'spend', status: 'current', note: 'revision' })
  })

  test('a request that uses the reserve waits for the head to confirm it', () => {
    const steps = buildRequestProgress({
      ...base,
      state: 'AWAITING_SPEND_SUBMISSION',
      needState: 'APPROVED',
      needDecision: 'APPROVED',
      spendStage: 'RESERVE_CONFIRMATION'
    })
    expect(steps[2]).toEqual({ key: 'spend', status: 'current', note: 'reserveConfirmation' })
  })
})

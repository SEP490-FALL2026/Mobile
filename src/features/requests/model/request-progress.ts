export type StepKey = 'submitted' | 'need' | 'spend' | 'execution'
export type StepStatus = 'done' | 'current' | 'pending' | 'failed' | 'skipped'

export interface ProgressStep {
  key: StepKey
  status: StepStatus
  /** Optional i18n sub-key describing why the step is waiting or skipped. */
  note?:
    | 'noDepartmentHead'
    | 'noSpendingApprover'
    | 'notRequired'
    | 'spendSubmission'
    | 'reserveConfirmation'
    | 'blocked'
    | 'revision'
    | 'itAssessment'
}

export interface ProgressInput {
  state: string
  hasSpendStep: boolean
  needState: string
  needDecision: string | null
  needWaitingReason: string | null
  spendStage: string | null
}

const ended = new Set(['REJECTED', 'IT_REJECTED', 'WITHDRAWN', 'CANCELLED'])
const spendOpen = new Set([
  'AWAITING_SPEND_SUBMISSION',
  'AWAITING_SPEND_DECISION',
  'AWAITING_REQUESTER_REVISION',
  'AWAITING_IT_ASSESSMENT'
])
const executionOpen = new Set(['AWAITING_EXECUTION', 'EXECUTING', 'AWAITING_IT_CLOSE', 'WAITING_CONTROLLED'])

export function buildRequestProgress(input: ProgressInput): ProgressStep[] {
  const closed = ended.has(input.state)
  const needApproved = input.needDecision === 'APPROVED' || input.needState === 'APPROVED'
  const needRejected = input.needDecision === 'REJECTED' || input.needState === 'REJECTED'
  const needNotRequired = input.needState === 'NOT_REQUIRED'
  const needSatisfied = needApproved || needNotRequired

  const need: ProgressStep = { key: 'need', status: 'pending' }
  if (needApproved) need.status = 'done'
  else if (needNotRequired) {
    need.status = 'skipped'
    need.note = 'notRequired'
  } else if (needRejected) need.status = 'failed'
  else if (closed || input.needState === 'CLOSED') need.status = 'skipped'
  else {
    need.status = 'current'
    if (input.needWaitingReason === 'NO_DEPARTMENT_HEAD') need.note = 'noDepartmentHead'
    if (input.needWaitingReason === 'NO_SPENDING_APPROVER') need.note = 'noSpendingApprover'
  }

  const steps: ProgressStep[] = [{ key: 'submitted', status: 'done' }, need]

  if (input.hasSpendStep) {
    const spend: ProgressStep = { key: 'spend', status: 'pending' }
    if (input.spendStage === 'REFUSED' || (input.state === 'REJECTED' && needSatisfied)) spend.status = 'failed'
    else if (!needSatisfied) spend.status = needRejected || closed ? 'skipped' : 'pending'
    else if (spendOpen.has(input.state)) {
      spend.status = 'current'
      if (input.state === 'AWAITING_SPEND_SUBMISSION') spend.note = 'spendSubmission'
      if (input.state === 'AWAITING_REQUESTER_REVISION') spend.note = 'revision'
      if (input.state === 'AWAITING_IT_ASSESSMENT') spend.note = 'itAssessment'
      if (input.spendStage === 'RESERVE_CONFIRMATION') spend.note = 'reserveConfirmation'
      if (input.spendStage === 'BLOCKED') spend.note = 'blocked'
    } else if (closed) spend.status = 'skipped'
    else spend.status = 'done'
    steps.push(spend)
  }

  const previousDone = steps.every((step) => step.status === 'done' || step.note === 'notRequired')
  const execution: ProgressStep = { key: 'execution', status: 'pending' }
  if (input.state === 'COMPLETED') execution.status = 'done'
  else if (input.state === 'FAILED') execution.status = 'failed'
  else if (closed || steps.some((step) => step.status === 'failed' || (step.status === 'skipped' && !step.note))) {
    execution.status = 'skipped'
  } else if (previousDone && executionOpen.has(input.state)) execution.status = 'current'
  steps.push(execution)
  return steps
}

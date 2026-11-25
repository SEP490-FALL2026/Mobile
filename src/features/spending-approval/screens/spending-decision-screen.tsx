import { usePreventRemove } from '@react-navigation/native'
import { Redirect, useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, Platform, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import type { LineSpendDecisionBodyDto, SpendDecisionBodyDto } from '@/shared/api/generated/contracts'
import { useSession } from '@/shared/api/session-context'
import { useAccountProfile } from '@/shared/api/use-account-profile'
import { goBackOr } from '@/shared/lib/go-back-or'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { BackButton } from '@/shared/ui/back-button'
import { LoadingState } from '@/shared/ui/loading-state'
import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import { KeyboardAwareScrollView } from '@/shared/ui/keyboard-aware-scroll-view'

import {
  ActionButton,
  DecisionForm,
  GroupLines,
  createSpendingStyles,
  getMutationErrorKey
} from '../components/spending-approval-parts'
import { useSpendApproval } from '../hooks/use-live-spending-approvals'
import { pendingSpendApprovalLines, spendDecisionErrorCode, type SpendDecision } from '../model/live-spending-approvals'

type ChecklistAnswers = Record<string, 'YES' | 'NO'>

function isPolicyConflict(error: unknown) {
  const code = spendDecisionErrorCode(error)
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    error.status === 409 &&
    (code === 'POLICY.VERSION_CHANGED' || code === 'POLICY.NOT_IN_FORCE')
  )
}

// The decision for one request: (group lines,) policy 1.7 checklist, outcome and reason. Sent once, never retried.
export function SpendingDecisionScreen({ requestId }: { requestId: string }) {
  const { colors } = useMobileTheme()
  const styles = createSpendingStyles(colors)
  const { t } = useTranslation()
  const router = useRouter()
  const session = useSession()
  const profile = useAccountProfile()
  const account = profile.data
  const isApprover = account?.roles.length === 1 && account.roles[0] === 'SPENDING_APPROVER'
  const [decision, setDecision] = useState<SpendDecision>()
  const [answers, setAnswers] = useState<ChecklistAnswers>({})
  const [reason, setReason] = useState('')
  const [lineDecisions, setLineDecisions] = useState<Record<string, 'APPROVE' | 'REJECT'>>({})
  const [recoveryBusy, setRecoveryBusy] = useState(false)
  const [recoveryError, setRecoveryError] = useState(false)
  const submissionStarted = useRef(false)
  const recoveryStarted = useRef(false)
  const { detail, lines, policy, decide, decideLines } = useSpendApproval(requestId, !!isApprover)

  const approval = detail.data
  const checklist = policy.data?.step.checklist ?? []
  const checklistReady = !!policy.data && !policy.isPending && !policy.isFetching && !policy.isError
  const hasNoAnswer = checklist.some((item) => item.check === 'PERSON' && answers[item.code] === 'NO')
  const checklistComplete = checklist.every((item) => item.check === 'SYSTEM' || answers[item.code] !== undefined)
  const groupedLines = useMemo(() => pendingSpendApprovalLines(lines.data ?? []), [lines.data])
  const groupedLinesReady = !lines.isPending && !lines.isFetching && !lines.isError && groupedLines.length > 0
  const allLinesChosen =
    groupedLines.length > 0 && groupedLines.every((line) => lineDecisions[line.employee.employeeId])
  const request = approval?.request
  const isGroup = !!request && request.beneficiary === null
  const mutationError = isGroup ? decideLines.error : decide.error
  const mutationPending = isGroup ? decideLines.isPending : decide.isPending
  const result = isGroup ? decideLines.data : decide.data
  const inFlight = mutationPending || (submissionStarted.current && !mutationError && !result)
  const submissionLocked = !!mutationError || !!result
  usePreventRemove(inFlight, () => undefined)
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => inFlight || (submissionStarted.current && !mutationError && !result)
      )
      return () => subscription.remove()
    }, [inFlight, mutationError, result])
  )
  const hasRejectedLine = groupedLines.some((line) => lineDecisions[line.employee.employeeId] === 'REJECT')
  const hasApprovedLine = groupedLines.some((line) => lineDecisions[line.employee.employeeId] === 'APPROVE')
  const requiresReason = isGroup ? decision === 'RETURN' || hasRejectedLine : !!decision && decision !== 'APPROVE'
  const reasonNeeded = requiresReason && !hasNoAnswer && reason.trim().length === 0
  const approvalBlocked = hasNoAnswer && (isGroup ? hasApprovedLine : decision === 'APPROVE')
  const canConfirm =
    !!decision &&
    !!approval &&
    !detail.isFetching &&
    !detail.isError &&
    approval.step.state === 'PENDING' &&
    checklistReady &&
    checklistComplete &&
    !approvalBlocked &&
    !reasonNeeded &&
    (!isGroup || (groupedLinesReady && (decision === 'RETURN' || allLinesChosen))) &&
    !mutationPending &&
    !submissionLocked

  function resetDecision() {
    setDecision(undefined)
    setAnswers({})
    setReason('')
    setLineDecisions({})
  }

  function answerAllYes() {
    setAnswers((current) => {
      const next = { ...current }
      for (const item of checklist) if (item.check === 'PERSON') next[item.code] = 'YES'
      return next
    })
  }

  function checklistBody() {
    if (!policy.data) throw new Error('Spending checklist is unavailable')
    return {
      policyVersionId: policy.data.policyVersionId,
      answers: checklist.map((item) => {
        const answer = item.check === 'SYSTEM' ? 'YES' : answers[item.code]
        if (!answer) throw new Error('Incomplete spending approval checklist')
        return { itemCode: item.code, answer }
      })
    }
  }

  async function reloadChangedPolicy() {
    if (recoveryStarted.current || !isPolicyConflict(mutationError)) return
    const previous = isGroup ? decideLines.variables : decide.variables
    if (!previous) return
    recoveryStarted.current = true
    setRecoveryBusy(true)
    setRecoveryError(false)
    resetDecision()
    const [updatedPolicy, updatedDetail, updatedLines] = await Promise.all([
      policy.refetch(),
      detail.refetch(),
      isGroup ? lines.refetch() : Promise.resolve(undefined)
    ])
    recoveryStarted.current = false
    setRecoveryBusy(false)
    if (
      updatedPolicy.isError ||
      !updatedPolicy.data ||
      updatedPolicy.data.policyVersionId === previous.body.checklist.policyVersionId ||
      updatedDetail.isError ||
      !updatedDetail.data ||
      updatedDetail.data.step.id !== previous.stepId ||
      updatedDetail.data.step.state !== 'PENDING' ||
      (updatedDetail.data.request.beneficiary === null) !== isGroup ||
      (isGroup && (!updatedLines || updatedLines.isError || !updatedLines.data))
    ) {
      setRecoveryError(true)
      return
    }
    if (isGroup) decideLines.reset()
    else decide.reset()
    submissionStarted.current = false
  }

  function submitDecision() {
    if (!approval || !canConfirm || !decision || submissionStarted.current) return
    if (isGroup) {
      if (!groupedLinesReady || !request || (decision !== 'RETURN' && !allLinesChosen)) return
      const body: LineSpendDecisionBodyDto = {
        lines: groupedLines.map((line) => {
          const lineDecision = decision === 'RETURN' ? 'RETURN' : lineDecisions[line.employee.employeeId]
          if (!lineDecision) throw new Error('Incomplete grouped spending decision')
          return {
            employeeId: line.employee.employeeId,
            decision: lineDecision,
            ...(lineDecision !== 'APPROVE' && reason.trim() ? { reason: reason.trim() } : {})
          }
        }),
        checklist: checklistBody()
      }
      submissionStarted.current = true
      decideLines.mutate({ id: requestId, stepId: approval.step.id, body })
      return
    }
    const body: SpendDecisionBodyDto = {
      decision,
      checklist: checklistBody(),
      ...(decision !== 'APPROVE' && reason.trim() ? { reason: reason.trim() } : {})
    }
    submissionStarted.current = true
    decide.mutate({ id: requestId, stepId: approval.step.id, body })
  }

  if (session.state === 'anonymous') return <Redirect href='/' />
  if (session.state === 'authenticated' && account && !isApprover) return <Redirect href='/home' />

  const appName =
    approval?.request.plan?.applicationName ?? approval?.request.softwareName ?? t('spending.live.unnamed')

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <BackButton
          disabled={inFlight}
          label={t('common.back')}
          onPress={() => goBackOr(router, { pathname: '/spending-approvals/[requestId]', params: { requestId } })}
        />
        <View style={styles.hero}>
          <Text style={styles.kicker}>{t('spending.live.makeDecision')}</Text>
          <Text accessibilityRole='header' style={styles.title}>
            {appName}
          </Text>
        </View>
        {result ? (
          <View accessibilityRole='alert' style={styles.successCard}>
            <Text style={styles.successText}>{t('spending.live.decisionSucceeded')}</Text>
          </View>
        ) : mutationError ? (
          <View style={styles.errorCard}>
            <Text accessibilityRole='alert' style={styles.errorText}>
              {t(getMutationErrorKey(mutationError))}
            </Text>
            {isPolicyConflict(mutationError) ? (
              <>
                <ActionButton
                  label={t('spending.live.reloadPolicy')}
                  disabled={recoveryBusy}
                  onPress={() => void reloadChangedPolicy()}
                />
                {recoveryError ? (
                  <Text accessibilityRole='alert' style={styles.errorText}>
                    {t('spending.live.policyReloadFailed')}
                  </Text>
                ) : null}
              </>
            ) : null}
          </View>
        ) : detail.isPending ? (
          <LoadingState label={t('spending.live.detailLoading')} />
        ) : detail.isError || !approval ? (
          <View style={styles.notice}>
            <Text accessibilityRole='alert' style={styles.bodyText}>
              {t('spending.live.detailError')}
            </Text>
            <ActionButton label={t('account.retry')} onPress={() => void detail.refetch()} />
          </View>
        ) : approval.step.state !== 'PENDING' ? (
          <Text accessibilityRole='alert' style={styles.noticeText}>
            {t('spending.live.notPending')}
          </Text>
        ) : (
          <>
            {isGroup ? (
              <GroupLines
                decisionError={lines.isError}
                decisions={lineDecisions}
                hasNoAnswer={hasNoAnswer}
                items={groupedLines}
                onChoose={(employeeId, nextDecision) =>
                  setLineDecisions((current) => ({ ...current, [employeeId]: nextDecision }))
                }
                onRetry={() => void lines.refetch()}
                loading={lines.isPending || lines.isFetching}
              />
            ) : null}
            <DecisionForm
              answers={answers}
              canConfirm={canConfirm}
              checklist={checklist}
              checklistComplete={checklistComplete}
              checklistError={policy.isError}
              checklistLoading={policy.isPending || policy.isFetching}
              decision={decision}
              hasRejectedLine={hasRejectedLine}
              hasNoAnswer={hasNoAnswer}
              isGroup={isGroup}
              oneStep={approval.routing.mode === 'ONE_STEP'}
              loading={mutationPending}
              onAnswer={(code, answer) => setAnswers((current) => ({ ...current, [code]: answer }))}
              onAnswerAll={answerAllYes}
              onChooseDecision={setDecision}
              onReasonChange={setReason}
              onRetryChecklist={() => void policy.refetch()}
              onSubmit={submitDecision}
              reason={reason}
              reasonNeeded={reasonNeeded}
            />
          </>
        )}
      </KeyboardAwareScrollView>
      {result ? (
        <View style={styles.footer}>
          <PressableFeedback
            accessibilityRole='button'
            onPress={() => router.dismissTo('/spending-approvals')}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>{t('spending.live.done')}</Text>
          </PressableFeedback>
        </View>
      ) : null}
    </SafeAreaView>
  )
}

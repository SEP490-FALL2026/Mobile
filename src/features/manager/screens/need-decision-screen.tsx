import { usePreventRemove } from '@react-navigation/native'
import { Redirect, useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, Platform, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useSession } from '@/shared/api/session-context'
import { useAccountProfile } from '@/shared/api/use-account-profile'
import { goBackOr } from '@/shared/lib/go-back-or'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { BackButton } from '@/shared/ui/back-button'
import { ChecklistQuestion } from '@/shared/ui/checklist-question'
import { ChecklistToolbar } from '@/shared/ui/checklist-toolbar'
import { Collapsible } from '@/shared/ui/collapsible'
import { ErrorReference } from '@/shared/ui/error-reference'
import { LoadingState } from '@/shared/ui/loading-state'
import { PressableFeedback } from '@/shared/ui/pressable-feedback'

import { ManagerGroupDecision } from '../components/manager-group-decision'
import { createNeedApprovalStyles } from '../components/need-approval-styles'
import { useAssignedNeedApproval, useNeedApproval } from '../hooks/use-live-need-approvals'
import { isDecidableNeedType } from '../model/group-need-decision.model'
import { decisionRefusal, isOpenNeedStep, policyVersionChanged } from '../model/need-decision.model'

// The need decision for one assigned request: outcome, policy 1.2 checklist and reason (or, for a group, person
// by person). Confirmed explicitly, sent once and never retried.
export function NeedDecisionScreen({ requestId }: { requestId: string }) {
  const { colors: mobileColors } = useMobileTheme()
  const styles = createNeedApprovalStyles(mobileColors)
  const { t } = useTranslation()
  const router = useRouter()
  const session = useSession()
  const profile = useAccountProfile()
  const isManager = !!profile.data?.roles.includes('MANAGER') && !profile.isError
  const hasScope = isManager && !!profile.data?.managerScope
  const [checklistOpen, setChecklistOpen] = useState(true)
  const [choice, setChoice] = useState<'APPROVE' | 'REJECT' | 'RETURN'>()
  const [response, setResponse] = useState<{ version: string; answers: Record<string, 'YES' | 'NO'> }>()
  const [reason, setReason] = useState('')
  const [validation, setValidation] = useState(false)
  const [groupBusy, setGroupBusy] = useState(false)
  const [groupDone, setGroupDone] = useState(false)
  const [recoveryBusy, setRecoveryBusy] = useState(false)
  const [recoveryError, setRecoveryError] = useState(false)
  const sent = useRef(false)
  const recovering = useRef(false)
  const assigned = useAssignedNeedApproval(requestId, hasScope)
  const item = assigned.data
  const decidable = !!item && isDecidableNeedType(item.type) && item.stepKind === 'NEED'
  const { detail, policy, decision } = useNeedApproval(decidable ? requestId : undefined, hasScope)
  const request = detail.data
  const checklist = policy.data?.step.checklist
  const answers = response && response.version === policy.data?.policyVersionId ? response.answers : {}
  const complete =
    !policy.isError &&
    !policy.isFetching &&
    !!checklist?.length &&
    checklist.every((entry) => entry.check === 'SYSTEM' || !!answers[entry.code])
  const personItems = checklist?.filter((entry) => entry.check === 'PERSON') ?? []
  const hasNo = checklist?.some((entry) => entry.check === 'PERSON' && answers[entry.code] === 'NO') ?? false
  const open = !!item && !!request && !detail.isError && isOpenNeedStep(request, item)
  const canDecide = hasScope && open && request?.type !== 'GROUP_GRANT'
  const canDecideGroup = (hasScope && open && request?.type === 'GROUP_GRANT') || groupDone
  const inFlight = decision.isPending || groupBusy || (sent.current && !decision.isError && !decision.isSuccess)
  usePreventRemove(inFlight, () => undefined)
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => inFlight || (sent.current && !decision.isError && !decision.isSuccess)
      )
      return () => subscription.remove()
    }, [decision.isError, decision.isSuccess, inFlight])
  )
  const locked = inFlight || decision.isError || decision.isSuccess
  const refusal = decision.isError ? decisionRefusal(decision.error) : undefined
  const blocked = locked || !canDecide || !complete || (choice === 'APPROVE' && hasNo)

  async function reloadChangedPolicy() {
    if (recovering.current || !decision.isError || !policyVersionChanged(decision.error)) return
    const previousVersion = decision.variables?.body.checklist.policyVersionId
    recovering.current = true
    setRecoveryBusy(true)
    setRecoveryError(false)
    setResponse(undefined)
    const [updatedPolicy, updatedDetail] = await Promise.all([policy.refetch(), detail.refetch()])
    recovering.current = false
    setRecoveryBusy(false)
    if (
      updatedPolicy.isError ||
      updatedDetail.isError ||
      !previousVersion ||
      !updatedPolicy.data ||
      updatedPolicy.data.policyVersionId === previousVersion
    ) {
      setRecoveryError(true)
      return
    }
    sent.current = false
    decision.reset()
  }

  function confirm() {
    if (!choice || !canDecide || !policy.data || !checklist || !complete || locked || sent.current) return
    if (choice === 'APPROVE' && hasNo) return
    if (choice !== 'APPROVE' && !hasNo && (reason.trim().length < 1 || reason.trim().length > 1000)) {
      setValidation(true)
      return
    }
    setValidation(false)
    sent.current = true
    decision.mutate({
      id: requestId,
      body: {
        decision: choice,
        ...(choice !== 'APPROVE' && reason.trim() ? { reason: reason.trim() } : {}),
        checklist: {
          policyVersionId: policy.data.policyVersionId,
          answers: checklist.map((entry) => ({
            itemCode: entry.code,
            answer: entry.check === 'SYSTEM' ? 'YES' : answers[entry.code]
          }))
        }
      }
    })
  }

  if (session.state === 'anonymous') return <Redirect href='/' />
  if (profile.data && !profile.isError && !isManager) return <Redirect href='/my-software' />

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps='handled'>
        <BackButton
          disabled={inFlight}
          label={t('common.back')}
          onPress={() => goBackOr(router, { pathname: '/live-need-approvals/[requestId]', params: { requestId } })}
        />
        <View style={styles.titleBlock}>
          <Text style={styles.kicker}>{t('manager.live.makeDecision')}</Text>
          {request ? (
            <Text accessibilityRole='header' style={styles.pageTitle}>
              {request.plan?.applicationName ?? request.proposal?.softwareName ?? t('requests.live.unnamed')}
            </Text>
          ) : null}
          {request ? (
            <Text style={styles.muted}>
              {t('manager.live.requestedBy', { name: request.beneficiary?.fullName ?? request.requester.fullName })}
            </Text>
          ) : null}
        </View>
        {!hasScope || assigned.isPending || (decidable && detail.isPending) ? (
          <LoadingState label={t('manager.live.loading')} />
        ) : assigned.isError ? (
          <View style={styles.card}>
            <Text accessibilityRole='alert' style={styles.error}>
              {t('manager.live.notificationError')}
            </Text>
            <PressableFeedback accessibilityRole='button' onPress={() => void assigned.refetch()} style={styles.action}>
              <Text style={styles.link}>{t('licenses.live.retry')}</Text>
            </PressableFeedback>
          </View>
        ) : !decidable ? (
          <Text accessibilityRole='alert' style={styles.error}>
            {t('manager.live.notificationUnavailable')}
          </Text>
        ) : detail.isError || !request ? (
          <View style={styles.card}>
            <Text accessibilityRole='alert' style={styles.error}>
              {t('manager.live.detailError')}
            </Text>
            <PressableFeedback accessibilityRole='button' onPress={() => void detail.refetch()} style={styles.action}>
              <Text style={styles.link}>{t('licenses.live.retry')}</Text>
            </PressableFeedback>
          </View>
        ) : (
          <>
            {decision.isSuccess ? (
              <Text accessibilityRole='summary' style={styles.success}>
                {t('manager.live.saved')}
              </Text>
            ) : null}
            {decision.isError ? (
              policyVersionChanged(decision.error) ? (
                <View>
                  <Text accessibilityRole='alert' style={styles.error}>
                    {t('manager.live.policyChanged')}
                  </Text>
                  {recoveryError ? (
                    <Text accessibilityRole='alert' style={styles.error}>
                      {t('manager.live.policyReloadError')}
                    </Text>
                  ) : null}
                  <PressableFeedback
                    accessibilityRole='button'
                    disabled={recoveryBusy}
                    accessibilityState={{ disabled: recoveryBusy, busy: recoveryBusy }}
                    onPress={() => void reloadChangedPolicy()}
                    style={styles.action}
                  >
                    <Text style={styles.link}>{t('manager.live.reloadChecklist')}</Text>
                  </PressableFeedback>
                </View>
              ) : (
                <>
                  <Text accessibilityRole='alert' style={styles.error}>
                    {refusal ? t(`manager.live.${refusal}`) : t('manager.live.uncertain')}
                  </Text>
                  <ErrorReference error={decision.error} />
                </>
              )
            ) : null}
            {!canDecide && !canDecideGroup && !locked ? (
              <Text accessibilityRole='alert' style={styles.error}>
                {t('manager.live.stale')}
              </Text>
            ) : null}
            {canDecideGroup ? (
              <View style={styles.card}>
                <ManagerGroupDecision
                  requestId={request.id}
                  checklist={policy.data}
                  checklistLoading={policy.isLoading}
                  checklistError={policy.isError}
                  onReloadChecklist={() => void policy.refetch()}
                  onBusyChange={setGroupBusy}
                  onDone={() => setGroupDone(true)}
                />
              </View>
            ) : null}
            {canDecide && !locked && !choice ? (
              <View style={styles.card}>
                <Text style={styles.muted}>{t('manager.live.chooseOutcome')}</Text>
                <View style={styles.actions}>
                  <PressableFeedback
                    accessibilityRole='button'
                    onPress={() => setChoice('REJECT')}
                    style={styles.outline}
                  >
                    <Text style={styles.link}>{t('manager.live.reject')}</Text>
                  </PressableFeedback>
                  <PressableFeedback
                    accessibilityRole='button'
                    onPress={() => setChoice('RETURN')}
                    style={styles.outline}
                  >
                    <Text style={styles.link}>{t('manager.live.return')}</Text>
                  </PressableFeedback>
                  <PressableFeedback
                    accessibilityRole='button'
                    onPress={() => setChoice('APPROVE')}
                    style={styles.primary}
                  >
                    <Text style={styles.primaryText}>{t('manager.live.approve')}</Text>
                  </PressableFeedback>
                </View>
              </View>
            ) : null}
            {choice && !decision.isSuccess ? (
              <View style={styles.card}>
                <Text style={styles.name}>
                  {t(
                    choice === 'APPROVE'
                      ? 'manager.live.confirmApprove'
                      : choice === 'REJECT'
                        ? 'manager.live.confirmReject'
                        : 'manager.live.confirmReturn'
                  )}
                </Text>
                <Text style={styles.muted}>{t('manager.live.confirmNote')}</Text>
                {policy.isLoading ? (
                  <Text accessibilityRole='progressbar' style={styles.muted}>
                    {t('manager.live.checklistLoading')}
                  </Text>
                ) : null}
                {policy.isError ? (
                  <PressableFeedback
                    accessibilityRole='button'
                    onPress={() => void policy.refetch()}
                    style={styles.action}
                  >
                    <Text accessibilityRole='alert' style={styles.error}>
                      {t('manager.live.checklistError')}
                    </Text>
                    <Text style={styles.link}>{t('licenses.live.retry')}</Text>
                  </PressableFeedback>
                ) : null}
                {checklist?.length ? (
                  <ChecklistToolbar
                    allYes={personItems.every((entry) => answers[entry.code] === 'YES')}
                    answerAllLabel={t('manager.live.answerAllYes')}
                    disabled={locked || !policy.data}
                    expanded={checklistOpen}
                    onAnswerAll={() => {
                      if (!policy.data) return
                      setResponse({
                        version: policy.data.policyVersionId,
                        answers: {
                          ...answers,
                          ...Object.fromEntries(personItems.map((entry) => [entry.code, 'YES' as const]))
                        }
                      })
                    }}
                    onToggle={() => setChecklistOpen((value) => !value)}
                    progressLabel={t('manager.live.checklistProgress', {
                      answered: personItems.filter((entry) => answers[entry.code] !== undefined).length,
                      total: personItems.length
                    })}
                    toggleLabel={t(checklistOpen ? 'manager.live.checklistCollapse' : 'manager.live.checklistExpand')}
                  />
                ) : null}
                <Collapsible expanded={checklistOpen}>
                  {checklist?.map((entry) => (
                    <ChecklistQuestion
                      key={entry.code}
                      answer={answers[entry.code]}
                      choiceRole='radio'
                      disabled={locked}
                      noLabel={t('manager.live.no')}
                      onAnswer={(answer) => {
                        if (!policy.data) return
                        setResponse({
                          version: policy.data.policyVersionId,
                          answers: { ...answers, [entry.code]: answer }
                        })
                      }}
                      system={entry.check === 'SYSTEM'}
                      systemLabel={t('manager.live.systemYes')}
                      text={entry.text}
                      yesLabel={t('manager.live.yes')}
                    />
                  ))}
                </Collapsible>
                {choice === 'APPROVE' && hasNo ? (
                  <Text style={styles.error}>{t('manager.live.noBlocksApproval')}</Text>
                ) : null}
                {choice !== 'APPROVE' ? (
                  <>
                    <Text style={styles.label}>{t('manager.live.rejectReason')}</Text>
                    <TextInput
                      accessibilityLabel={t('manager.live.rejectReason')}
                      editable={!locked}
                      multiline
                      maxLength={1000}
                      value={reason}
                      onChangeText={(text) => {
                        setReason(text)
                        setValidation(false)
                      }}
                      style={styles.input}
                    />
                    {validation ? (
                      <Text accessibilityRole='alert' style={styles.error}>
                        {t('manager.live.reasonRequired')}
                      </Text>
                    ) : null}
                  </>
                ) : null}
                <View style={styles.actions}>
                  <PressableFeedback
                    accessibilityRole='button'
                    accessibilityState={{ disabled: locked }}
                    disabled={locked}
                    onPress={() => setChoice(undefined)}
                    style={[styles.outline, locked && styles.disabled]}
                  >
                    <Text style={styles.link}>{t('common.cancel')}</Text>
                  </PressableFeedback>
                  <PressableFeedback
                    accessibilityRole='button'
                    accessibilityState={{ disabled: blocked, busy: decision.isPending }}
                    disabled={blocked}
                    onPress={confirm}
                    style={[styles.primary, blocked && styles.disabled]}
                  >
                    <Text style={styles.primaryText}>{t('manager.live.confirm')}</Text>
                  </PressableFeedback>
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
      {decision.isSuccess || groupDone ? (
        <View style={styles.footer}>
          <PressableFeedback
            accessibilityRole='button'
            onPress={() => router.dismissTo('/live-need-approvals')}
            style={styles.primary}
          >
            <Text style={styles.primaryText}>{t('manager.live.done')}</Text>
          </PressableFeedback>
        </View>
      ) : null}
    </SafeAreaView>
  )
}

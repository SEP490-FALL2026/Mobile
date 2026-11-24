import { Feather } from '@expo/vector-icons'
import { usePreventRemove } from '@react-navigation/native'
import { Redirect, useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Collapsible } from '@/shared/ui/collapsible'
import { BackButton } from '@/shared/ui/back-button'
import { ChecklistQuestion } from '@/shared/ui/checklist-question'
import { ChipButton } from '@/shared/ui/chip-button'
import { ChecklistToolbar } from '@/shared/ui/checklist-toolbar'
import { EmptyState } from '@/shared/ui/empty-state'
import { RefreshStatus, useRefreshFeedback } from '@/shared/ui/refresh-status'
import { LoadingState } from '@/shared/ui/loading-state'
import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import type { NeedQueueResponseDtoDataItemsItem } from '@/shared/api/generated/contracts/need-decisions'
import { useSession } from '@/shared/api/session-context'
import { useAccountProfile } from '@/shared/api/use-account-profile'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { ErrorReference } from '@/shared/ui/error-reference'

import { ManagerGroupDecision } from '../components/manager-group-decision'
import { NeedQueueCard } from '../components/need-queue-card'
import { SimilarSeats } from '../components/similar-seats'
import { useLiveNeedApprovals, useNotificationNeedApproval } from '../hooks/use-live-need-approvals'
import { isDecidableNeedType } from '../model/group-need-decision.model'

function policyVersionChanged(error: unknown) {
  if (typeof error !== 'object' || error === null || !('status' in error) || error.status !== 409 || !('info' in error))
    return false
  const info = error.info
  if (typeof info !== 'object' || info === null || !('error' in info)) return false
  const detail = info.error
  return typeof detail === 'object' && detail !== null && 'code' in detail && detail.code === 'POLICY.VERSION_CHANGED'
}

function decisionRefusal(error: unknown) {
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

export function LiveNeedApprovalsScreen({
  notification
}: {
  notification?: { requestId: string; source: 'assigned' | 'reminder' }
} = {}) {
  const { colors: mobileColors } = useMobileTheme()
  const styles = createStyles(mobileColors)
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const session = useSession()
  const [page, setPage] = useState(1)
  const queueRefresh = useRefreshFeedback()
  const [checklistOpen, setChecklistOpen] = useState(true)
  const [selected, setSelected] = useState<NeedQueueResponseDtoDataItemsItem>()
  const [choice, setChoice] = useState<'APPROVE' | 'REJECT' | 'RETURN'>()
  const [response, setResponse] = useState<{ version: string; answers: Record<string, 'YES' | 'NO'> }>()
  const [reason, setReason] = useState('')
  const [validation, setValidation] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [groupBusy, setGroupBusy] = useState(false)
  const [groupDone, setGroupDone] = useState(false)
  const [logoutError, setLogoutError] = useState(false)
  const [recoveryBusy, setRecoveryBusy] = useState(false)
  const [recoveryError, setRecoveryError] = useState(false)
  const sent = useRef(false)
  const recoveryEpoch = useRef(0)
  const recovering = useRef(false)
  const handledNotification = useRef<string | undefined>(undefined)
  const profile = useAccountProfile()
  const isManager = !!profile.data?.roles.includes('MANAGER') && !profile.isError
  const hasScope = isManager && !!profile.data?.managerScope
  const { queue, detail, policy, decision } = useLiveNeedApprovals(page, selected?.requestId, hasScope)
  const notificationLookup = useNotificationNeedApproval(notification?.requestId, hasScope)
  useEffect(() => {
    if (
      !notification ||
      !hasScope ||
      selected ||
      notificationLookup.isFetching ||
      !notificationLookup.isSuccess ||
      handledNotification.current === `${notification.source}:${notification.requestId}`
    )
      return
    handledNotification.current = `${notification.source}:${notification.requestId}`
    if (isDecidableNeedType(notificationLookup.data?.type) && notificationLookup.data?.stepKind === 'NEED') {
      setSelected(notificationLookup.data)
    } else if (!notificationLookup.data && notification.source === 'reminder') {
      router.replace({ pathname: '/live-requests/[requestId]', params: { requestId: notification.requestId } })
    }
  }, [
    notification,
    hasScope,
    selected,
    notificationLookup.isFetching,
    notificationLookup.isSuccess,
    notificationLookup.data,
    router
  ])
  const request = detail.data
  const checklist = policy.data?.step.checklist
  const answers = response && response.version === policy.data?.policyVersionId ? response.answers : {}
  const complete =
    !policy.isError &&
    !policy.isFetching &&
    !!checklist?.length &&
    checklist.every((item) => item.check === 'SYSTEM' || !!answers[item.code])
  const personItems = checklist?.filter((item) => item.check === 'PERSON') ?? []
  const hasNo = checklist?.some((item) => item.check === 'PERSON' && answers[item.code] === 'NO') ?? false
  const canDecide =
    hasScope &&
    !!selected &&
    !!request &&
    !detail.isError &&
    request.id === selected.requestId &&
    (request.type === 'GRANT' || request.type === 'RENEWAL') &&
    request.needStep.id === selected.stepId &&
    request.needStep.state === 'PENDING' &&
    !request.needDecision
  const groupDecidable =
    hasScope &&
    !!selected &&
    !!request &&
    !detail.isError &&
    request.id === selected.requestId &&
    request.type === 'GROUP_GRANT' &&
    request.needStep.id === selected.stepId &&
    request.needStep.state === 'PENDING'
  const canDecideGroup = groupDecidable || groupDone
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

  function closeDetails() {
    if (inFlight || (sent.current && !decision.isError && !decision.isSuccess)) return
    setSelected(undefined)
    setGroupDone(false)
    setChoice(undefined)
    setResponse(undefined)
    setReason('')
    setValidation(false)
    recoveryEpoch.current += 1
    recovering.current = false
    setRecoveryBusy(false)
    setRecoveryError(false)
    sent.current = false
    decision.reset()
  }
  // Leaving the tab ends the review, so coming back shows the queue instead of the last opened request.
  const leaveRef = useRef<() => void>(() => undefined)
  useEffect(() => {
    leaveRef.current = () => {
      if (selected) closeDetails()
    }
  })
  useFocusEffect(useCallback(() => () => leaveRef.current(), []))
  async function reloadChangedPolicy() {
    if (recovering.current || !decision.isError || !policyVersionChanged(decision.error)) return
    const epoch = recoveryEpoch.current
    const previousVersion = decision.variables?.body.checklist.policyVersionId
    recovering.current = true
    setRecoveryBusy(true)
    setRecoveryError(false)
    setResponse(undefined)
    const [updatedPolicy, updatedDetail] = await Promise.all([policy.refetch(), detail.refetch()])
    if (epoch !== recoveryEpoch.current) return
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
    if (!selected || !choice || !canDecide || !policy.data || !checklist || !complete || locked || sent.current) return
    if (choice === 'APPROVE' && hasNo) return
    if (choice !== 'APPROVE' && !hasNo && (reason.trim().length < 1 || reason.trim().length > 1000)) {
      setValidation(true)
      return
    }
    setValidation(false)
    sent.current = true
    decision.mutate({
      id: selected.requestId,
      body: {
        decision: choice,
        ...(choice !== 'APPROVE' && reason.trim() ? { reason: reason.trim() } : {}),
        checklist: {
          policyVersionId: policy.data.policyVersionId,
          answers: checklist.map((item) => ({
            itemCode: item.code,
            answer: item.check === 'SYSTEM' ? 'YES' : answers[item.code]
          }))
        }
      }
    })
  }
  async function logout() {
    if (loggingOut || inFlight || (sent.current && !decision.isError && !decision.isSuccess)) return
    setLoggingOut(true)
    setLogoutError(false)
    try {
      await session.logout()
    } catch {
      setLogoutError(true)
    } finally {
      setLoggingOut(false)
    }
  }
  if (session.state === 'anonymous') return <Redirect href='/' />
  if (profile.data && !profile.isError && !isManager) return <Redirect href='/my-software' />
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps='handled'>
          {logoutError ? (
            <Text accessibilityRole='alert' style={styles.error}>
              {t('licenses.live.logoutError')}
            </Text>
          ) : null}
          {(session.state === 'loading' || profile.isLoading) && !profile.isError ? (
            <Text accessibilityRole='progressbar' style={styles.muted}>
              {t('auth.profileLoading')}
            </Text>
          ) : null}
          {!selected && profile.isError ? (
            <View>
              <Text accessibilityRole='alert' style={styles.error}>
                {t('manager.live.profileError')}
              </Text>
              <PressableFeedback
                accessibilityRole='button'
                onPress={() => void profile.refetch()}
                style={styles.action}
              >
                <Text style={styles.link}>{t('licenses.live.retry')}</Text>
              </PressableFeedback>
              <PressableFeedback
                accessibilityRole='button'
                disabled={loggingOut}
                accessibilityState={{ disabled: loggingOut, busy: loggingOut }}
                onPress={() => void logout()}
                style={styles.action}
              >
                <Text style={styles.link}>{t('licenses.live.logout')}</Text>
              </PressableFeedback>
            </View>
          ) : null}
          {selected ? (
            <BackButton disabled={inFlight} label={t('manager.live.backQueue')} onPress={closeDetails} variant='chip' />
          ) : null}
          {isManager ? (
            <View style={styles.titleBlock}>
              <Text accessibilityRole='header' style={styles.pageTitle}>
                {selected ? t('manager.live.details') : t('manager.live.title')}
              </Text>
              <Text style={styles.muted}>{t('manager.live.scope')}</Text>
            </View>
          ) : null}
          {isManager && !selected ? (
            <>
              {hasScope && notification && notificationLookup.isFetching ? (
                <Text accessibilityRole='progressbar' style={styles.muted}>
                  {t('manager.live.notificationLoading')}
                </Text>
              ) : null}
              {hasScope && notification && notificationLookup.isError ? (
                <View style={styles.card}>
                  <Text accessibilityRole='alert' style={styles.error}>
                    {t('manager.live.notificationError')}
                  </Text>
                  <PressableFeedback
                    accessibilityRole='button'
                    onPress={() => void notificationLookup.refetch()}
                    style={styles.action}
                  >
                    <Text style={styles.link}>{t('licenses.live.retry')}</Text>
                  </PressableFeedback>
                </View>
              ) : null}
              {hasScope &&
              notification &&
              notificationLookup.isSuccess &&
              !notificationLookup.isFetching &&
              (!isDecidableNeedType(notificationLookup.data?.type) || notificationLookup.data?.stepKind !== 'NEED') &&
              (notificationLookup.data || notification.source === 'assigned') ? (
                <Text accessibilityRole='alert' style={styles.error}>
                  {t('manager.live.notificationUnavailable')}
                </Text>
              ) : null}
              {!hasScope ? (
                <View style={styles.card}>
                  <Text accessibilityRole='alert' style={styles.error}>
                    {t('manager.live.noScope')}
                  </Text>
                  <PressableFeedback
                    accessibilityRole='button'
                    onPress={() => void profile.refetch()}
                    style={styles.action}
                  >
                    <Text style={styles.link}>{t('licenses.live.retry')}</Text>
                  </PressableFeedback>
                </View>
              ) : null}
              {hasScope && (session.state === 'loading' || queue.isLoading) ? (
                <LoadingState label={t('manager.live.loading')} />
              ) : null}
              {hasScope && queue.isError ? (
                <View style={styles.card}>
                  <Text accessibilityRole='alert' style={styles.error}>
                    {t('manager.live.queueError')}
                  </Text>
                  <PressableFeedback
                    accessibilityRole='button'
                    onPress={() => void queue.refetch()}
                    style={styles.action}
                  >
                    <Text style={styles.link}>{t('licenses.live.retry')}</Text>
                  </PressableFeedback>
                  {page > 1 ? (
                    <PressableFeedback
                      accessibilityRole='button'
                      onPress={() => setPage(page - 1)}
                      style={styles.action}
                    >
                      <Text style={styles.link}>{t('licenses.live.previous')}</Text>
                    </PressableFeedback>
                  ) : null}
                </View>
              ) : null}
              {hasScope && queue.data ? (
                <View style={styles.summaryRow}>
                  <View style={styles.summaryCard}>
                    <View style={styles.summaryHeading}>
                      <Feather
                        accessibilityElementsHidden
                        importantForAccessibility='no'
                        name='inbox'
                        size={18}
                        color={mobileColors.primaryInk}
                      />
                      <Text style={styles.summaryLabel}>{t('manager.live.assignedLabel')}</Text>
                    </View>
                    <Text style={styles.summaryCount}>
                      {new Intl.NumberFormat(i18n.language).format(queue.data.pagination.totalItems)}
                    </Text>
                  </View>
                </View>
              ) : null}
              {hasScope ? (
                <ChipButton
                  disabled={queue.isFetching || queueRefresh.state === 'loading'}
                  icon='refresh-cw'
                  label={t('manager.live.refreshQueue')}
                  onPress={() => void queueRefresh.refresh(queue.refetch)}
                />
              ) : null}
              <RefreshStatus
                failedLabel={t('common.refreshFailed')}
                doneLabel={t('common.refreshed')}
                loadingLabel={t('common.refreshing')}
                state={queueRefresh.state}
              />
              {hasScope && queue.data?.items.length === 0 ? <EmptyState title={t('manager.live.empty')} /> : null}
              {hasScope &&
                queue.data?.items.map((item) => <NeedQueueCard key={item.stepId} item={item} onPress={setSelected} />)}
              {hasScope && queue.data && queue.data.pagination.totalPages > 1 ? (
                <View style={styles.pagination}>
                  <PressableFeedback
                    accessibilityRole='button'
                    accessibilityState={{ disabled: page <= 1 }}
                    disabled={page <= 1}
                    onPress={() => setPage(page - 1)}
                    style={[styles.action, page <= 1 && styles.disabled]}
                  >
                    <Text style={styles.link}>{t('licenses.live.previous')}</Text>
                  </PressableFeedback>
                  <Text style={styles.muted}>
                    {t('licenses.live.page', { page: new Intl.NumberFormat(i18n.language).format(page) })}
                  </Text>
                  <PressableFeedback
                    accessibilityRole='button'
                    accessibilityState={{ disabled: page >= queue.data.pagination.totalPages }}
                    disabled={page >= queue.data.pagination.totalPages}
                    onPress={() => setPage(page + 1)}
                    style={[styles.action, page >= queue.data.pagination.totalPages && styles.disabled]}
                  >
                    <Text style={styles.link}>{t('licenses.live.next')}</Text>
                  </PressableFeedback>
                </View>
              ) : null}
            </>
          ) : hasScope && selected ? (
            <>
              {detail.isLoading ? <LoadingState label={t('manager.live.loading')} /> : null}
              {detail.isError ? (
                <View style={styles.card}>
                  <Text accessibilityRole='alert' style={styles.error}>
                    {t('manager.live.detailError')}
                  </Text>
                  <PressableFeedback
                    accessibilityRole='button'
                    onPress={() => void detail.refetch()}
                    style={styles.action}
                  >
                    <Text style={styles.link}>{t('licenses.live.retry')}</Text>
                  </PressableFeedback>
                </View>
              ) : null}
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
              {request ? (
                <View style={styles.card}>
                  <Text style={styles.name}>
                    {request.plan?.applicationName ?? request.proposal?.softwareName ?? t('requests.live.unnamed')}
                  </Text>
                  {request.plan ? (
                    <Text style={styles.muted}>{t('licenses.live.plan', { plan: request.plan.planName })}</Text>
                  ) : null}
                  <Text style={styles.muted}>{t('requests.live.reference', { id: request.id })}</Text>
                  <Text style={styles.label}>{t('requests.live.requester')}</Text>
                  <Text style={styles.value}>{request.requester.fullName}</Text>
                  {request.beneficiary ? (
                    <>
                      <Text style={styles.label}>{t('requests.live.beneficiary')}</Text>
                      <Text style={styles.value}>{request.beneficiary.fullName}</Text>
                    </>
                  ) : null}
                  <Text style={styles.label}>{t('manager.live.departmentLabel')}</Text>
                  <Text style={styles.value}>{request.department.name}</Text>
                  <Text style={styles.label}>{t('requests.live.reason')}</Text>
                  <Text style={styles.value}>{request.businessReason}</Text>
                  <Text style={styles.label}>{t('requests.live.term')}</Text>
                  <Text style={styles.value}>
                    {request.termMonths === null
                      ? t('manager.live.noTerm')
                      : t('requests.live.months', {
                          months: new Intl.NumberFormat(i18n.language).format(request.termMonths)
                        })}
                  </Text>
                  {request.type !== 'GROUP_GRANT' ? <SimilarSeats requestId={request.id} /> : null}
                  <Text style={styles.label}>{t('manager.live.cost')}</Text>
                  <Text style={styles.value}>
                    {request.pricing.status === 'NOT_APPLICABLE'
                      ? t('manager.live.costNotApplicable')
                      : request.pricing.status === 'MISSING'
                        ? t('manager.live.costMissing')
                        : (formatCost(request.pricing.amount, i18n.language) ?? t('manager.live.costUnavailable'))}
                  </Text>
                  {!canDecide && !canDecideGroup && !locked && !detail.isError ? (
                    <Text accessibilityRole='alert' style={styles.error}>
                      {t('manager.live.stale')}
                    </Text>
                  ) : null}
                  {canDecideGroup ? (
                    <ManagerGroupDecision
                      requestId={request.id}
                      checklist={policy.data}
                      checklistLoading={policy.isLoading}
                      checklistError={policy.isError}
                      onReloadChecklist={() => void policy.refetch()}
                      onBusyChange={setGroupBusy}
                      onDone={() => setGroupDone(true)}
                    />
                  ) : null}
                  {canDecide && !locked && !choice ? (
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
                  ) : null}
                  {choice && !decision.isSuccess ? (
                    <View style={styles.confirm}>
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
                          allYes={personItems.every((item) => answers[item.code] === 'YES')}
                          answerAllLabel={t('manager.live.answerAllYes')}
                          disabled={locked || !policy.data}
                          expanded={checklistOpen}
                          onAnswerAll={() => {
                            if (!policy.data) return
                            setResponse({
                              version: policy.data.policyVersionId,
                              answers: {
                                ...answers,
                                ...Object.fromEntries(personItems.map((item) => [item.code, 'YES' as const]))
                              }
                            })
                          }}
                          onToggle={() => setChecklistOpen((open) => !open)}
                          progressLabel={t('manager.live.checklistProgress', {
                            answered: personItems.filter((item) => answers[item.code] !== undefined).length,
                            total: personItems.length
                          })}
                          toggleLabel={t(
                            checklistOpen ? 'manager.live.checklistCollapse' : 'manager.live.checklistExpand'
                          )}
                        />
                      ) : null}
                      <Collapsible expanded={checklistOpen}>
                        {checklist?.map((item) => (
                          <ChecklistQuestion
                            key={item.code}
                            answer={answers[item.code]}
                            choiceRole='radio'
                            disabled={locked}
                            noLabel={t('manager.live.no')}
                            onAnswer={(answer) => {
                              if (!policy.data) return
                              setResponse({
                                version: policy.data.policyVersionId,
                                answers: { ...answers, [item.code]: answer }
                              })
                            }}
                            system={item.check === 'SYSTEM'}
                            systemLabel={t('manager.live.systemYes')}
                            text={item.text}
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
                          <Text style={styles.link}>{t('requests.cancel')}</Text>
                        </PressableFeedback>
                        <PressableFeedback
                          accessibilityRole='button'
                          accessibilityState={{
                            disabled: locked || !canDecide || !complete || (choice === 'APPROVE' && hasNo),
                            busy: decision.isPending
                          }}
                          disabled={locked || !canDecide || !complete || (choice === 'APPROVE' && hasNo)}
                          onPress={confirm}
                          style={[
                            styles.primary,
                            (locked || !canDecide || !complete || (choice === 'APPROVE' && hasNo)) && styles.disabled
                          ]}
                        >
                          <Text style={styles.primaryText}>{t('manager.live.confirm')}</Text>
                        </PressableFeedback>
                      </View>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

function formatCost(value: { amount: string; currency: string } | null, locale: string) {
  if (!value || !/^[A-Z]{3}$/.test(value.currency) || !/^\d{1,12}(\.\d{1,2})?$/.test(value.amount)) return undefined
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: value.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(value.amount))
}

const createStyles = (mobileColors: MobileColors) =>
  StyleSheet.create({
    titleBlock: { gap: 4 },
    pageTitle: { color: mobileColors.foreground, fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
    safe: { flex: 1, backgroundColor: mobileColors.background },
    screen: { flex: 1 },
    profile: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: mobileColors.border
    },
    profileIdentity: { flex: 1, minWidth: 0, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 9 },
    profileActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    personalButton: {
      flex: 1,
      minHeight: 44,
      paddingHorizontal: 14,
      borderCurve: 'continuous',
      borderRadius: 14,
      backgroundColor: mobileColors.primarySoft,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    personalLabel: { color: mobileColors.primaryInk, fontWeight: '700', fontSize: 13, flexShrink: 1 },
    iconButton: {
      width: 44,
      height: 44,
      borderCurve: 'continuous',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: mobileColors.border,
      backgroundColor: mobileColors.white,
      alignItems: 'center',
      justifyContent: 'center'
    },
    review: { color: mobileColors.primary, fontWeight: '700', fontSize: 12 },
    reviewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 5 },
    summaryRow: { flexDirection: 'row', gap: 10 },
    content: { padding: 16, paddingBottom: 30, gap: 14 },
    action: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' },
    link: { color: mobileColors.primaryInk, fontWeight: '700' },
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 18,
      borderCurve: 'continuous',
      borderRadius: 20,
      backgroundColor: mobileColors.primarySoft
    },
    headingCopy: { flex: 1, gap: 5 },
    kicker: {
      color: mobileColors.primaryInk,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase'
    },
    title: { color: mobileColors.foreground, fontSize: 25, fontWeight: '700' },
    icon: {
      width: 44,
      height: 44,
      borderCurve: 'continuous',
      borderRadius: 16,
      backgroundColor: mobileColors.surface,
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      backgroundColor: mobileColors.white,
      borderColor: mobileColors.border,
      borderWidth: 1,
      borderCurve: 'continuous',
      borderRadius: 16,
      padding: 16,
      gap: 9
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    avatar: {
      width: 38,
      height: 38,
      borderCurve: 'continuous',
      borderRadius: 19,
      backgroundColor: mobileColors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center'
    },
    avatarText: { color: mobileColors.primaryInk, fontWeight: '700' },
    divider: { height: 1, backgroundColor: mobileColors.border },
    name: { color: mobileColors.foreground, fontSize: 16, fontWeight: '700', flexShrink: 1 },
    summaryCard: {
      flex: 1,
      backgroundColor: mobileColors.surface,
      borderColor: mobileColors.border,
      borderWidth: 1,
      borderCurve: 'continuous',
      borderRadius: 16,
      padding: 18,
      gap: 10
    },
    summaryHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    summaryLabel: { color: mobileColors.primaryInk, fontSize: 13, fontWeight: '700', flexShrink: 1 },
    summaryCount: { color: mobileColors.foreground, fontSize: 24, fontWeight: '700' },
    label: { color: mobileColors.muted, fontSize: 12, marginTop: 4 },
    value: { color: mobileColors.foreground, fontSize: 14, lineHeight: 20 },
    muted: { color: mobileColors.muted, fontSize: 13, lineHeight: 19 },
    heroSubtitle: { color: mobileColors.foreground },
    error: { color: mobileColors.danger, fontSize: 13, lineHeight: 19 },
    success: { color: mobileColors.success, fontSize: 13, lineHeight: 19 },
    pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
    outline: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: mobileColors.border,
      borderCurve: 'continuous',
      borderRadius: 12,
      paddingHorizontal: 15,
      justifyContent: 'center',
      alignItems: 'center'
    },
    primary: {
      minHeight: 48,
      backgroundColor: mobileColors.primary,
      borderCurve: 'continuous',
      borderRadius: 12,
      paddingHorizontal: 15,
      justifyContent: 'center',
      alignItems: 'center'
    },
    primaryText: { color: mobileColors.onPrimary, fontWeight: '700' },
    disabled: { opacity: 0.4 },
    input: {
      minHeight: 90,
      borderColor: mobileColors.border,
      borderWidth: 1,
      borderCurve: 'continuous',
      borderRadius: 12,
      padding: 12,
      color: mobileColors.foreground,
      textAlignVertical: 'top'
    },
    confirm: { borderTopWidth: 1, borderTopColor: mobileColors.border, paddingTop: 12, gap: 10 }
  })

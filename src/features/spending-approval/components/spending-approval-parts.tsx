import { type ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TextInput, View } from 'react-native'

import type { ApprovalDetailResponseDtoDataSpendApproval } from '@/shared/api/generated/contracts'
import type { LinesResponseDtoDataItemsItem } from '@/shared/api/generated/contracts/group-requests'
import type { PolicyStepResponseDtoDataStepChecklistItem } from '@/shared/api/generated/contracts/policies'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { ChecklistQuestion } from '@/shared/ui/checklist-question'
import { ChecklistToolbar } from '@/shared/ui/checklist-toolbar'
import { Collapsible } from '@/shared/ui/collapsible'
import { PressableFeedback } from '@/shared/ui/pressable-feedback'

import {
  formatSpendDate,
  formatSpendMoney,
  spendDecisionErrorCode,
  type SpendDecision
} from '../model/live-spending-approvals'

type ChecklistAnswers = Record<string, 'YES' | 'NO'>

// Presentation pieces shared by the spending queue, request detail and decision screens.
export function ApprovalSummary({
  approval,
  dueOn,
  locale,
  onFormatUnavailable
}: {
  approval: ApprovalDetailResponseDtoDataSpendApproval
  dueOn?: string
  locale: string
  onFormatUnavailable: string
}) {
  const { colors } = useMobileTheme()
  const { t } = useTranslation()
  const styles = createSpendingStyles(colors)
  const request = approval.request
  const endDate = formatSpendDate(request.expectedEndDate, locale)
  const amount = approval.cost?.estimatedCost
    ? (formatSpendMoney(approval.cost.estimatedCost, locale) ?? onFormatUnavailable)
    : onFormatUnavailable
  return (
    <InfoCard title={t('spending.live.requestSummary')}>
      <InfoRow
        label={t('spending.live.requester', { name: request.requester.fullName })}
        value={request.requester.employeeCode}
      />
      {request.beneficiary ? (
        <InfoRow
          label={t('spending.live.beneficiary', { name: request.beneficiary.fullName })}
          value={request.beneficiary.employeeCode}
        />
      ) : null}
      <InfoRow label={t('spending.live.costCenterLabel')} value={request.costCenter.code} />
      <InfoRow label={t('spending.live.estimatedCost')} value={amount} />
      {approval.cost ? (
        <>
          <InfoRow
            label={t('spending.live.preTax')}
            value={formatSpendMoney(approval.cost.preTax, locale) ?? onFormatUnavailable}
          />
          <InfoRow
            label={t('spending.live.tax')}
            value={formatSpendMoney(approval.cost.tax, locale) ?? onFormatUnavailable}
          />
          <InfoRow
            label={t('spending.live.totalPayable')}
            value={formatSpendMoney(approval.cost.totalPayable, locale) ?? onFormatUnavailable}
          />
        </>
      ) : null}
      {approval.annualVendorAmount ? (
        <InfoRow
          label={t('spending.live.annualVendorAmount')}
          value={formatSpendMoney(approval.annualVendorAmount, locale) ?? onFormatUnavailable}
        />
      ) : null}
      <InfoRow
        label={t('spending.live.term')}
        value={
          request.termMonths === null
            ? t('spending.live.noTerm')
            : t('spending.live.termMonths', { count: request.termMonths })
        }
      />
      {endDate ? <InfoRow label={t('spending.live.expectedEndDate')} value={endDate} /> : null}
      {dueOn ? <InfoRow label={t('spending.live.dueDateLabel')} value={dueOn} /> : null}
      {request.beneficiary === null ? (
        <InfoRow
          label={t('spending.live.groupCount', {
            formattedCount: new Intl.NumberFormat(locale).format(request.lineCount)
          })}
          value={t('spending.live.individualDecisionOnly')}
        />
      ) : null}
      {request.budgetYear ? <InfoRow label={t('spending.live.budgetYear')} value={String(request.budgetYear)} /> : null}
      <Text style={styles.bodyText}>{request.businessReason}</Text>
      {approval.need ? (
        <View style={styles.separator}>
          <InfoRow label={t('spending.live.needDecision')} value={approval.need.decidedBy.fullName} />
          {approval.need.reason ? <InfoRow label={t('spending.live.needReason')} value={approval.need.reason} /> : null}
        </View>
      ) : null}
      {approval.routing.mode === 'ONE_STEP' && approval.routing.oneStepReason ? (
        <Text style={styles.noticeText}>
          {t('spending.live.oneStepReason', {
            reason: t(`spending.live.oneStepReasons.${approval.routing.oneStepReason}`)
          })}
        </Text>
      ) : null}
      <InfoRow
        label={t('spending.live.slaWorkingDays')}
        value={t('spending.live.workingDays', { count: approval.step.slaWorkingDays })}
      />
    </InfoCard>
  )
}

export function GroupLines({
  items,
  decisions,
  hasNoAnswer,
  onChoose,
  loading,
  decisionError,
  onRetry
}: {
  items: LinesResponseDtoDataItemsItem[]
  decisions: Record<string, 'APPROVE' | 'REJECT'>
  hasNoAnswer: boolean
  onChoose: (employeeId: string, decision: 'APPROVE' | 'REJECT') => void
  loading: boolean
  decisionError: boolean
  onRetry: () => void
}) {
  const { colors } = useMobileTheme()
  const { t } = useTranslation()
  const styles = createSpendingStyles(colors)
  return (
    <InfoCard title={t('spending.live.groupTitle')}>
      {loading ? (
        <Text accessibilityRole='progressbar' style={styles.muted}>
          {t('spending.live.groupLoading')}
        </Text>
      ) : null}
      {decisionError ? (
        <View>
          <Text accessibilityRole='alert' style={styles.errorText}>
            {t('spending.live.groupError')}
          </Text>
          <ActionButton label={t('account.retry')} onPress={onRetry} />
        </View>
      ) : null}
      {!loading && !decisionError && items.length === 0 ? (
        <Text accessibilityRole='alert' style={styles.noticeText}>
          {t('spending.live.groupNoPendingLines')}
        </Text>
      ) : null}
      {items.map((item) => {
        const selected = decisions[item.employee.employeeId]
        return (
          <View key={item.employee.employeeId} style={styles.lineCard}>
            <View style={styles.flex}>
              <Text style={styles.bodyText}>{item.employee.fullName}</Text>
              <Text style={styles.muted}>{item.employee.employeeCode}</Text>
            </View>
            <ChoiceButton
              disabled={hasNoAnswer}
              label={t('spending.live.approve')}
              selected={selected === 'APPROVE'}
              onPress={() => onChoose(item.employee.employeeId, 'APPROVE')}
            />
            <ChoiceButton
              label={t('spending.live.reject')}
              selected={selected === 'REJECT'}
              onPress={() => onChoose(item.employee.employeeId, 'REJECT')}
            />
          </View>
        )
      })}
    </InfoCard>
  )
}

export function DecisionForm({
  checklist,
  answers,
  onAnswer,
  onAnswerAll,
  decision,
  hasRejectedLine,
  onChooseDecision,
  isGroup,
  oneStep,
  hasNoAnswer,
  checklistComplete,
  checklistLoading,
  checklistError,
  onRetryChecklist,
  reason,
  onReasonChange,
  reasonNeeded,
  canConfirm,
  loading,
  onSubmit
}: {
  checklist: PolicyStepResponseDtoDataStepChecklistItem[]
  answers: ChecklistAnswers
  onAnswer: (code: string, answer: 'YES' | 'NO') => void
  onAnswerAll: () => void
  decision?: SpendDecision
  hasRejectedLine: boolean
  onChooseDecision: (decision: SpendDecision | undefined) => void
  isGroup: boolean
  oneStep: boolean
  hasNoAnswer: boolean
  checklistComplete: boolean
  checklistLoading: boolean
  checklistError: boolean
  onRetryChecklist: () => void
  reason: string
  onReasonChange: (reason: string) => void
  reasonNeeded: boolean
  canConfirm: boolean
  loading: boolean
  onSubmit: () => void
}) {
  const { colors } = useMobileTheme()
  const { t } = useTranslation()
  const styles = createSpendingStyles(colors)
  const [expanded, setExpanded] = useState(true)
  const personItems = checklist.filter((item) => item.check === 'PERSON')
  const answered = personItems.filter((item) => answers[item.code] !== undefined).length
  const allYes = personItems.length > 0 && personItems.every((item) => answers[item.code] === 'YES')
  return (
    <InfoCard title={t('spending.live.decisionTitle')}>
      {checklist.length > 0 ? (
        <ChecklistToolbar
          allYes={allYes}
          answerAllLabel={t('spending.live.answerAllYes')}
          disabled={personItems.length === 0}
          expanded={expanded}
          onAnswerAll={onAnswerAll}
          onToggle={() => setExpanded((value) => !value)}
          progressLabel={t('spending.live.checklistProgress', { answered, total: personItems.length })}
          toggleLabel={t(expanded ? 'spending.live.checklistCollapse' : 'spending.live.checklistExpand')}
        />
      ) : null}
      {checklistLoading ? (
        <Text accessibilityRole='progressbar' style={styles.muted}>
          {t('spending.live.checklistLoading')}
        </Text>
      ) : null}
      {checklistError ? (
        <View>
          <Text accessibilityRole='alert' style={styles.errorText}>
            {t('spending.live.checklistError')}
          </Text>
          <ActionButton label={t('account.retry')} onPress={onRetryChecklist} />
        </View>
      ) : null}
      <Collapsible expanded={expanded}>
        {checklist.map((item) => (
          <ChecklistQuestion
            key={item.code}
            answer={answers[item.code]}
            noLabel={t('spending.live.no')}
            onAnswer={(answer) => onAnswer(item.code, answer)}
            system={item.check === 'SYSTEM'}
            systemLabel={t('spending.live.systemYes')}
            text={item.text}
            yesLabel={t('spending.live.yes')}
          />
        ))}
      </Collapsible>
      {!checklistComplete && !checklistLoading && !checklistError ? (
        <Text accessibilityRole='alert' style={styles.noticeText}>
          {t('spending.live.checklistIncomplete')}
        </Text>
      ) : null}
      {hasNoAnswer ? (
        <Text accessibilityRole='alert' style={styles.noticeText}>
          {t('spending.live.noBlocksApproval')}
        </Text>
      ) : null}
      <View style={styles.decisionChoices}>
        <ChoiceButton
          disabled={hasNoAnswer && !isGroup}
          label={t(isGroup ? 'spending.live.groupContinue' : 'spending.live.approve')}
          selected={decision === 'APPROVE'}
          onPress={() => onChooseDecision(decision === 'APPROVE' ? undefined : 'APPROVE')}
        />
        {!isGroup ? (
          <ChoiceButton
            label={t('spending.live.reject')}
            selected={decision === 'REJECT'}
            onPress={() => onChooseDecision(decision === 'REJECT' ? undefined : 'REJECT')}
          />
        ) : null}
        <ChoiceButton
          label={t(oneStep ? 'spending.live.returnToRequester' : 'spending.live.returnToHead')}
          selected={decision === 'RETURN'}
          onPress={() => onChooseDecision(decision === 'RETURN' ? undefined : 'RETURN')}
        />
      </View>
      {decision && (decision !== 'APPROVE' || (isGroup && hasRejectedLine)) ? (
        <View style={styles.reasonInputGroup}>
          <Text style={styles.fieldLabel}>{t('spending.live.reasonLabel')}</Text>
          <TextInput
            accessibilityLabel={t('spending.live.reasonLabel')}
            maxLength={1000}
            multiline
            onChangeText={onReasonChange}
            placeholder={t('spending.live.reasonPlaceholder')}
            placeholderTextColor={colors.muted}
            style={styles.reasonInput}
            value={reason}
          />
          {reasonNeeded ? (
            <Text accessibilityRole='alert' style={styles.errorText}>
              {t('spending.live.reasonRequired')}
            </Text>
          ) : null}
        </View>
      ) : null}
      {isGroup && decision === 'RETURN' ? (
        <Text style={styles.noticeText}>{t('spending.live.returnAllNotice')}</Text>
      ) : null}
      <ActionButton
        disabled={!canConfirm || checklistLoading || checklistError}
        label={loading ? t('spending.live.submitting') : t('spending.live.confirmDecision')}
        onPress={onSubmit}
      />
    </InfoCard>
  )
}

export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  const { colors } = useMobileTheme()
  const styles = createSpendingStyles(colors)
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  const { colors } = useMobileTheme()
  const styles = createSpendingStyles(colors)
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )
}

export function ActionButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  const { colors } = useMobileTheme()
  const styles = createSpendingStyles(colors)
  return (
    <PressableFeedback
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.actionButton, disabled && styles.buttonDisabled]}
    >
      <Text style={styles.actionButtonText}>{label}</Text>
    </PressableFeedback>
  )
}

function ChoiceButton({
  label,
  selected,
  onPress,
  disabled
}: {
  label: string
  selected: boolean
  onPress: () => void
  disabled?: boolean
}) {
  const { colors } = useMobileTheme()
  const styles = createSpendingStyles(colors)
  return (
    <PressableFeedback
      accessibilityRole='button'
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.choiceButton, selected && styles.choiceSelected, disabled && styles.buttonDisabled]}
    >
      <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text>
    </PressableFeedback>
  )
}

export function getMutationErrorKey(error: unknown) {
  const status = typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined
  const code = spendDecisionErrorCode(error)
  const uncertain = 'spending.live.errors.uncertain'
  switch (code) {
    case 'POLICY.VERSION_CHANGED':
    case 'POLICY.NOT_IN_FORCE':
      return status === 409 ? 'spending.live.errors.policyChanged' : uncertain
    case 'POLICY.CHECKLIST_HAS_NO':
      return status === 422 ? 'spending.live.errors.checklistNo' : uncertain
    case 'POLICY.CHECKLIST_INCOMPLETE':
      return status === 422 ? 'spending.live.errors.checklistIncomplete' : uncertain
    case 'SPEND.NOT_CHECKABLE':
      return status === 409 ? 'spending.live.errors.notCheckable' : uncertain
    case 'SPEND.NOT_THE_ASSIGNEE':
    case 'SPEND.OWN_REQUEST':
      return status === 403 ? 'spending.live.errors.notAssigned' : uncertain
    case 'SPEND.RECHECKED_RETURNED_TO_HEAD':
    case 'SPEND.RECHECKED_RETURNED_TO_REQUESTER':
      return status === 409 ? 'spending.live.errors.returned' : uncertain
    case 'GROUP_REQUEST.LINES_MISMATCH':
      return status === 422 ? 'spending.live.errors.stale' : uncertain
    case 'SPEND.NO_SPEND_STEP':
    case 'SPEND.STEP_NOT_PENDING':
    case 'SPEND.STALE_STATE':
    case 'GROUP_REQUEST.LINE_NOT_PENDING':
    case 'ACCESS_REQUEST.GROUP_USES_LINES':
      return status === 409 ? 'spending.live.errors.stale' : uncertain
    case 'SPEND.BUDGET_BLOCKED':
      return status === 409 ? 'spending.live.errors.budgetBlocked' : uncertain
    case 'BUDGET.COMMITMENT_NOT_HOLDABLE':
    case 'BUDGET.COMMITMENT_EXISTS':
      return status === 409 ? 'spending.live.errors.commitment' : uncertain
    default:
      return uncertain
  }
}

export const createSpendingStyles = (colors: MobileColors) =>
  StyleSheet.create({
    safe: { backgroundColor: colors.background, experimental_backgroundImage: colors.backgroundGradient, flex: 1 },
    screen: { flex: 1 },
    content: { gap: 16, padding: 18, paddingBottom: 26 },
    header: { alignItems: 'center', flexDirection: 'row', gap: 12, minHeight: 54 },
    profile: { flex: 1 },
    hero: { gap: 6, paddingVertical: 8 },
    kicker: {
      color: colors.primaryInk,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase'
    },
    title: { color: colors.foreground, fontSize: 24, fontWeight: '700', letterSpacing: -0.3 },
    sectionTitle: { color: colors.foreground, fontSize: 15, fontWeight: '700' },
    bodyText: { color: colors.foreground, fontSize: 13, lineHeight: 20 },
    muted: { color: colors.muted, fontSize: 12, lineHeight: 18 },
    flex: { flex: 1, gap: 4 },
    section: { gap: 13 },
    reviewHeader: { alignItems: 'center', flexDirection: 'row', gap: 12 },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 18,
      borderWidth: 1,
      gap: 12,
      padding: 15
    },
    notice: {
      backgroundColor: colors.surfaceSubtle,
      borderCurve: 'continuous',
      borderRadius: 14,
      gap: 10,
      padding: 14
    },
    noticeText: {
      backgroundColor: colors.warningBackground,
      borderCurve: 'continuous',
      borderRadius: 10,
      color: colors.warning,
      fontSize: 12,
      lineHeight: 18,
      overflow: 'hidden',
      padding: 10
    },
    errorCard: {
      backgroundColor: colors.warningBackground,
      borderCurve: 'continuous',
      borderRadius: 14,
      gap: 10,
      padding: 14
    },
    errorText: { color: colors.danger, fontSize: 12, lineHeight: 18 },
    successCard: {
      backgroundColor: colors.successBackground,
      borderCurve: 'continuous',
      borderRadius: 14,
      gap: 10,
      padding: 14
    },
    successText: { color: colors.success, fontSize: 13, fontWeight: '700' },
    infoRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
    infoLabel: { color: colors.muted, flex: 1, fontSize: 12, lineHeight: 18 },
    infoValue: {
      color: colors.foreground,
      flexShrink: 1,
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 18,
      textAlign: 'right'
    },
    separator: { borderTopColor: colors.border, borderTopWidth: 1, gap: 8, paddingTop: 10 },
    queueHeader: { alignItems: 'center', flexDirection: 'row', gap: 10 },
    iconButton: {
      alignItems: 'center',
      backgroundColor: colors.primarySoft,
      borderCurve: 'continuous',
      borderRadius: 12,
      height: 42,
      justifyContent: 'center',
      width: 42
    },
    search: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 9,
      minHeight: 46,
      paddingHorizontal: 12
    },
    searchInput: { color: colors.foreground, flex: 1, fontSize: 16, minHeight: 44, paddingVertical: 0 },
    list: { gap: 10 },
    emptyState: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSubtle,
      borderCurve: 'continuous',
      borderRadius: 16,
      gap: 8,
      padding: 22
    },
    emptyTitle: { color: colors.foreground, fontSize: 14, fontWeight: '700', textAlign: 'center' },
    actionButton: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: colors.primarySoft,
      borderCurve: 'continuous',
      borderRadius: 11,
      justifyContent: 'center',
      minHeight: 40,
      paddingHorizontal: 13,
      paddingVertical: 8
    },
    actionButtonText: { color: colors.primaryInk, fontSize: 12, fontWeight: '700', textAlign: 'center' },
    buttonDisabled: { opacity: 0.45 },
    lineCard: {
      alignItems: 'center',
      borderTopColor: colors.border,
      borderTopWidth: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
      paddingTop: 10
    },
    question: { borderTopColor: colors.border, borderTopWidth: 1, gap: 9, paddingTop: 11 },
    systemAnswer: { color: colors.success, fontSize: 12, fontWeight: '700' },
    choiceRow: { flexDirection: 'row', gap: 8 },
    decisionChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    choiceButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSubtle,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 10,
      borderWidth: 1,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: 11,
      paddingVertical: 7
    },
    choiceSelected: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
    choiceText: { color: colors.foreground, fontSize: 12, fontWeight: '600' },
    choiceTextSelected: { color: colors.primaryInk, fontWeight: '700' },
    reasonInputGroup: { gap: 7 },
    fieldLabel: { color: colors.foreground, fontSize: 12, fontWeight: '700' },
    reasonInput: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 12,
      borderWidth: 1,
      color: colors.foreground,
      fontSize: 14,
      minHeight: 90,
      padding: 11,
      textAlignVertical: 'top'
    },
    footer: {
      backgroundColor: colors.backgroundEnd,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      paddingHorizontal: 18,
      paddingVertical: 12
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderCurve: 'continuous',
      borderRadius: 14,
      justifyContent: 'center',
      minHeight: 50
    },
    primaryButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' }
  })

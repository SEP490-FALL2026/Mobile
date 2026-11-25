import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useSession } from '@/shared/api/session-context'
import { useAccountProfile } from '@/shared/api/use-account-profile'
import { goBackOr } from '@/shared/lib/go-back-or'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { BackButton } from '@/shared/ui/back-button'
import { LoadingState } from '@/shared/ui/loading-state'
import { PressableFeedback } from '@/shared/ui/pressable-feedback'

import { LiveSpendingBudgetSnapshot } from '../components/live-spending-budget-snapshot'
import {
  ActionButton,
  ApprovalSummary,
  InfoCard,
  InfoRow,
  createSpendingStyles
} from '../components/spending-approval-parts'
import { useAssignedSpendApproval, useSpendApproval } from '../hooks/use-live-spending-approvals'
import { formatSpendDate, formatSpendMoney } from '../model/live-spending-approvals'

// One assigned request: what is being bought, for whom, and the budget it lands in. The decision itself is a
// separate screen so this one stays readable.
export function SpendingApprovalDetailScreen({ requestId }: { requestId: string }) {
  const { colors } = useMobileTheme()
  const styles = createSpendingStyles(colors)
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const session = useSession()
  const profile = useAccountProfile()
  const account = profile.data
  const isApprover = account?.roles.length === 1 && account.roles[0] === 'SPENDING_APPROVER'
  const assigned = useAssignedSpendApproval(requestId, !!isApprover)
  const { detail } = useSpendApproval(assigned.data ? requestId : undefined, !!isApprover)
  const approval = detail.data
  const pending = approval?.step.state === 'PENDING'

  if (session.state === 'anonymous') return <Redirect href='/' />
  if (session.state === 'authenticated' && account && !isApprover) return <Redirect href='/home' />

  const appName =
    approval?.request.plan?.applicationName ?? approval?.request.softwareName ?? t('spending.live.unnamed')
  const planName = approval?.request.plan?.planName

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton label={t('common.back')} onPress={() => goBackOr(router, '/spending-approvals')} />
        {assigned.isPending || (assigned.data && detail.isPending) ? (
          <LoadingState label={t('spending.live.detailLoading')} />
        ) : assigned.isError ? (
          <View style={styles.notice}>
            <Text accessibilityRole='alert' style={styles.bodyText}>
              {t('spending.live.notificationError')}
            </Text>
            <ActionButton label={t('account.retry')} onPress={() => void assigned.refetch()} />
          </View>
        ) : !assigned.data ? (
          <Text accessibilityRole='alert' style={styles.noticeText}>
            {t('spending.live.notificationUnavailable')}
          </Text>
        ) : detail.isError || !approval ? (
          <View style={styles.notice}>
            <Text accessibilityRole='alert' style={styles.bodyText}>
              {t('spending.live.detailError')}
            </Text>
            <ActionButton label={t('account.retry')} onPress={() => void detail.refetch()} />
          </View>
        ) : (
          <>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewIcon}>
                <Feather
                  accessibilityElementsHidden
                  color={colors.primaryInk}
                  importantForAccessibility='no'
                  name='credit-card'
                  size={20}
                />
              </View>
              <View style={styles.flex}>
                <Text accessibilityRole='header' style={styles.title}>
                  {appName}
                </Text>
                {planName ? <Text style={styles.muted}>{planName}</Text> : null}
              </View>
            </View>
            {!pending ? (
              <Text accessibilityRole='alert' style={styles.noticeText}>
                {t('spending.live.notPending')}
              </Text>
            ) : null}
            <ApprovalSummary
              approval={approval}
              dueOn={formatSpendDate(assigned.data.dueOn, i18n.language)}
              locale={i18n.language}
              onFormatUnavailable={t('spending.live.amountUnavailable')}
            />
            <LiveSpendingBudgetSnapshot approval={approval} />
            {approval.termCost ? (
              <InfoCard title={t('spending.live.termCostTitle')}>
                <InfoRow
                  label={t('spending.live.currentYearCost', { year: approval.termCost.currentYear.year })}
                  value={
                    formatSpendMoney(approval.termCost.currentYear.amount, i18n.language) ??
                    t('spending.live.amountUnavailable')
                  }
                />
                {approval.termCost.nextYear ? (
                  <InfoRow
                    label={t('spending.live.nextYearCost')}
                    value={
                      formatSpendMoney(approval.termCost.nextYear.amount, i18n.language) ??
                      t('spending.live.amountUnavailable')
                    }
                  />
                ) : null}
                {approval.termCost.termCutAt ? (
                  <InfoRow
                    label={t('spending.live.termCutAt')}
                    value={
                      formatSpendDate(approval.termCost.termCutAt, i18n.language) ?? t('spending.live.notAvailable')
                    }
                  />
                ) : null}
              </InfoCard>
            ) : null}
            {approval.assessment ? (
              <InfoCard title={t('spending.live.assessmentTitle')}>
                {approval.assessment.classification ? (
                  <InfoRow
                    label={t('spending.live.classification')}
                    value={t(
                      approval.assessment.classification === 'INTERNAL'
                        ? 'spending.live.classifications.internal'
                        : 'spending.live.classifications.paidLicensed'
                    )}
                  />
                ) : null}
                {approval.assessment.controlLevel ? (
                  <InfoRow
                    label={t('spending.live.controlLevel')}
                    value={t(`spending.live.controlLevels.${approval.assessment.controlLevel}`)}
                  />
                ) : null}
                {approval.assessment.dataSensitivity ? (
                  <InfoRow label={t('spending.live.dataSensitivity')} value={approval.assessment.dataSensitivity} />
                ) : null}
                {approval.assessment.controlRiskNote ? (
                  <InfoRow label={t('spending.live.controlRisk')} value={approval.assessment.controlRiskNote} />
                ) : null}
                {approval.assessment.equivalentTool ? (
                  <InfoRow
                    label={t('spending.live.equivalentTool')}
                    value={approval.assessment.equivalentTool.planName}
                  />
                ) : null}
              </InfoCard>
            ) : null}
          </>
        )}
      </ScrollView>
      {approval && assigned.data && pending ? (
        <View style={styles.footer}>
          <PressableFeedback
            accessibilityRole='button'
            onPress={() => router.push({ pathname: '/spending-approvals/[requestId]/decide', params: { requestId } })}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>{t('spending.live.makeDecision')}</Text>
          </PressableFeedback>
        </View>
      ) : null}
    </SafeAreaView>
  )
}

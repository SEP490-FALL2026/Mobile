import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import type { ApprovalListResponseDtoDataItemsItem } from '@/shared/api/generated/contracts/spend-approvals'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { formatSpendDate, formatSpendMoney } from '../model/live-spending-approvals'

export function LiveSpendingApprovalCard({
  item,
  onPress
}: {
  item: ApprovalListResponseDtoDataItemsItem
  onPress: (requestId: string) => void
}) {
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  const { t, i18n } = useTranslation()
  const appName = item.plan?.applicationName ?? item.softwareName ?? t('spending.live.unnamed')
  const amount = formatSpendMoney(item.amount, i18n.language)
  const dueDate = formatSpendDate(item.dueOn, i18n.language)
  const primaryCodeKey = getPrimaryCodeKey(item.primaryCode)

  return (
    <PressableFeedback
      accessibilityRole='button'
      accessibilityLabel={t('spending.live.openRequest', { software: appName, name: item.requester.fullName })}
      onPress={() => onPress(item.requestId)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <View style={styles.icon}>
          <Feather
            accessibilityElementsHidden
            color={colors.primaryInk}
            importantForAccessibility='no'
            name='credit-card'
            size={19}
          />
        </View>
        <View style={styles.titleGroup}>
          <Text style={styles.appName}>{appName}</Text>
          {item.plan ? <Text style={styles.planName}>{item.plan.planName}</Text> : null}
        </View>
        <Feather
          accessibilityElementsHidden
          color={colors.muted}
          importantForAccessibility='no'
          name='chevron-right'
          size={19}
        />
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>{t('spending.live.requester', { name: item.requester.fullName })}</Text>
        {item.beneficiary ? (
          <Text style={styles.metaText}>{t('spending.live.beneficiary', { name: item.beneficiary.fullName })}</Text>
        ) : null}
        {item.beneficiary === null ? (
          <Text style={styles.metaText}>
            {t('spending.live.groupCount', {
              formattedCount: new Intl.NumberFormat(i18n.language).format(item.lineCount)
            })}
          </Text>
        ) : null}
        <Text style={styles.metaText}>{t('spending.live.costCenter', { code: item.costCenter.code })}</Text>
        {primaryCodeKey ? <Text style={styles.primaryCode}>{t(primaryCodeKey)}</Text> : null}
      </View>
      <View style={styles.bottom}>
        <View style={styles.badges}>
          {item.outcome === 'USES_RESERVE' ? (
            <Text style={styles.reserveBadge}>{t('spending.live.usesReserve')}</Text>
          ) : null}
          {item.routing.mode === 'ONE_STEP' ? (
            <Text style={styles.oneStepBadge}>{t('spending.live.oneStep')}</Text>
          ) : null}
          {item.nextYearBudget?.warning ? (
            <Text style={styles.warningBadge}>{t('spending.live.nextYearWarning')}</Text>
          ) : null}
        </View>
        <View style={styles.amountGroup}>
          <Text style={styles.amount}>{amount ?? t('spending.live.amountUnavailable')}</Text>
          <Text style={styles.dueDate}>
            {dueDate ? t('spending.live.dueOn', { date: dueDate }) : t('spending.live.dueDateUnavailable')}
          </Text>
        </View>
      </View>
    </PressableFeedback>
  )
}

function getPrimaryCodeKey(code: string | null) {
  switch (code) {
    case 'BUDGET_OK':
      return 'spending.live.primaryCodes.budgetOk'
    case 'HIGH_VALUE':
      return 'spending.live.primaryCodes.highValue'
    case 'INSUFFICIENT_BUDGET':
      return 'spending.live.primaryCodes.insufficientBudget'
    case 'NO_ACTIVE_BUDGET':
      return 'spending.live.primaryCodes.noActiveBudget'
    case 'CLOSED_OR_EXPIRED_BUDGET_PERIOD':
      return 'spending.live.primaryCodes.closedOrExpiredBudgetPeriod'
    case 'STALE_COST_EVIDENCE':
      return 'spending.live.primaryCodes.staleCostEvidence'
    default:
      return undefined
  }
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 18,
      borderWidth: 1,
      gap: 12,
      padding: 15
    },
    pressed: { opacity: 0.8 },
    top: { alignItems: 'center', flexDirection: 'row', gap: 11 },
    icon: {
      alignItems: 'center',
      backgroundColor: colors.primarySoft,
      borderCurve: 'continuous',
      borderRadius: 13,
      height: 42,
      justifyContent: 'center',
      width: 42
    },
    titleGroup: { flex: 1, gap: 3 },
    appName: { color: colors.foreground, fontSize: 15, fontWeight: '700' },
    planName: { color: colors.muted, fontSize: 12 },
    meta: { gap: 4, paddingLeft: 53 },
    metaText: { color: colors.muted, fontSize: 12, lineHeight: 17 },
    primaryCode: { color: colors.primaryInk, fontSize: 12, fontWeight: '600', lineHeight: 16 },
    bottom: {
      alignItems: 'flex-end',
      borderTopColor: colors.border,
      borderTopWidth: 1,
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'space-between',
      paddingTop: 10
    },
    badges: { alignItems: 'flex-start', flex: 1, flexWrap: 'wrap', flexDirection: 'row', gap: 5 },
    reserveBadge: {
      backgroundColor: colors.warningBackground,
      borderCurve: 'continuous',
      borderRadius: 8,
      color: colors.warning,
      fontSize: 12,
      fontWeight: '700',
      overflow: 'hidden',
      paddingHorizontal: 8,
      paddingVertical: 5
    },
    oneStepBadge: {
      backgroundColor: colors.primarySoft,
      borderCurve: 'continuous',
      borderRadius: 8,
      color: colors.primaryInk,
      fontSize: 12,
      fontWeight: '700',
      overflow: 'hidden',
      paddingHorizontal: 8,
      paddingVertical: 5
    },
    warningBadge: {
      backgroundColor: colors.dangerBackground,
      borderCurve: 'continuous',
      borderRadius: 8,
      color: colors.danger,
      fontSize: 12,
      fontWeight: '700',
      overflow: 'hidden',
      paddingHorizontal: 8,
      paddingVertical: 5
    },
    amountGroup: { alignItems: 'flex-end', gap: 3 },
    amount: { color: colors.foreground, fontSize: 13, fontVariant: ['tabular-nums'], fontWeight: '700' },
    dueDate: { color: colors.muted, fontSize: 12 }
  })

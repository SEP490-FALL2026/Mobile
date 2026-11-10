import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import type { ApprovalDetailResponseDtoDataSpendApprovalBudgetSnapshot } from '@/shared/api/generated/model'
import { mobileColors } from '@/shared/theme/colors'

import { formatDate, formatMoney, outcomeTone, type Money } from '../model/spending-approvals'
import { detailStyles } from './detail-parts'
import { StatusChip } from './status-chip'

interface BudgetSnapshotCardProps {
  snapshot: ApprovalDetailResponseDtoDataSpendApprovalBudgetSnapshot
}

/** Read-only snapshot of the budget as the latest check read it. Mobile never edits it. */
export function BudgetSnapshotCard({ snapshot }: BudgetSnapshotCardProps) {
  const { i18n, t } = useTranslation()
  const money = (value: Money | null | undefined) => formatMoney(value, i18n.language) ?? t('spending.budget.noFigure')

  return (
    <View accessibilityLabel={t('spending.budget.accessibleLabel')} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole='header' style={styles.title}>
            {t('spending.budget.title')}
          </Text>
          <Text style={detailStyles.muted}>{t('spending.budget.readOnlyHint')}</Text>
        </View>
        <StatusChip label={t('spending.budget.readOnly')} />
      </View>

      {!snapshot ? (
        <Text style={detailStyles.muted}>{t('spending.budget.unavailable')}</Text>
      ) : (
        <>
          <View style={styles.checkRow}>
            <StatusChip label={t(`spending.outcome.${snapshot.outcome}`)} tone={outcomeTone(snapshot.outcome)} />
            <Text style={styles.total}>
              {t('spending.budget.year', { year: snapshot.year })} ·{' '}
              {formatDate(snapshot.computedAt, i18n.language) ?? t('spending.dateUnavailable')}
            </Text>
          </View>
          {snapshot.blockedReasons.length > 0 ? (
            <View style={styles.reasons}>
              {snapshot.blockedReasons.map((reason) => (
                <Text key={reason} style={detailStyles.error}>
                  {t(`spending.blockedReasons.${reason}`)}
                </Text>
              ))}
            </View>
          ) : null}
          {snapshot.base ? (
            <View style={styles.figures}>
              <Line label={t('spending.budget.base')} value={money(snapshot.base)} />
              <Line label={t('spending.budget.reserve')} value={money(snapshot.reserve)} />
              <Line label={t('spending.budget.committed')} value={money(snapshot.committed)} />
              <Line label={t('spending.budget.spent')} value={money(snapshot.spent)} />
              <Line label={t('spending.budget.pending')} value={money(snapshot.pending)} />
              <Line emphasized label={t('spending.budget.remainingBase')} value={money(snapshot.remainingBase)} />
              <Line label={t('spending.budget.remainingWithReserve')} value={money(snapshot.remainingWithReserve)} />
              {snapshot.overBaseBy ? (
                <Line label={t('spending.budget.overBase')} value={money(snapshot.overBaseBy)} />
              ) : null}
              {snapshot.overBy ? (
                <Line label={t('spending.budget.overReserve')} value={money(snapshot.overBy)} />
              ) : null}
            </View>
          ) : (
            <Text style={detailStyles.muted}>{t('spending.budget.noBudget')}</Text>
          )}
          {snapshot.reserveConfirmation ? (
            <View style={styles.confirmation}>
              <Text style={styles.confirmationTitle}>
                {t('spending.budget.reserveConfirmed', { name: snapshot.reserveConfirmation.confirmedBy.fullName })}
              </Text>
              <Text style={detailStyles.muted}>{snapshot.reserveConfirmation.reason}</Text>
            </View>
          ) : snapshot.outcome === 'USES_RESERVE' ? (
            <Text style={styles.warning}>{t('spending.budget.reserveUnconfirmed')}</Text>
          ) : null}
        </>
      )}
    </View>
  )
}

function Line({ emphasized, label, value }: { emphasized?: boolean; label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Text style={styles.lineLabel}>{label}</Text>
      <Text style={[styles.lineValue, emphasized && styles.lineEmphasis]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: mobileColors.surfaceSubtle,
    borderColor: mobileColors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 16
  },
  checkRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  confirmation: { backgroundColor: mobileColors.successSoft, borderRadius: 12, gap: 4, padding: 12 },
  confirmationTitle: { color: mobileColors.success, fontSize: 13, fontWeight: '700' },
  figures: {
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    padding: 12
  },
  header: { alignItems: 'flex-start', flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  headerCopy: { flex: 1, gap: 3 },
  line: { alignItems: 'center', flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  lineEmphasis: { color: mobileColors.primaryInk, fontSize: 15, fontWeight: '700' },
  lineLabel: { color: mobileColors.muted, flexShrink: 1, fontSize: 13 },
  lineValue: { color: mobileColors.foreground, fontSize: 13, fontWeight: '600' },
  reasons: { gap: 2 },
  title: { color: mobileColors.foreground, fontSize: 15, fontWeight: '700' },
  total: { color: mobileColors.muted, fontSize: 12 },
  warning: { color: mobileColors.warning, fontSize: 12, lineHeight: 18 }
})

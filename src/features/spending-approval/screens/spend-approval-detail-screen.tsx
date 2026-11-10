import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import type { ApprovalListResponseDtoDataItemsItem } from '@/shared/api/generated/model/spend-approvals'
import { mobileColors } from '@/shared/theme/colors'

import { BudgetSnapshotCard } from '../components/budget-snapshot-card'
import { DecisionPanel } from '../components/decision-panel'
import { DetailCard, detailStyles, Field } from '../components/detail-parts'
import { StatusChip } from '../components/status-chip'
import { useSpendDecision, useSpendDetail } from '../hooks/use-spend-approvals'
import { decisionErrorKey, formatDate, formatMoney, outcomeTone } from '../model/spending-approvals'

interface SpendApprovalDetailProps {
  item: ApprovalListResponseDtoDataItemsItem
  onBack: () => void
}

export function SpendApprovalDetail({ item, onBack }: SpendApprovalDetailProps) {
  const { i18n, t } = useTranslation()
  const detailQuery = useSpendDetail(item.requestId, true)
  const decision = useSpendDecision()
  const detail = detailQuery.data
  const name = item.plan?.applicationName ?? item.softwareName ?? t('spending.unnamed')
  const money = (value: Parameters<typeof formatMoney>[0]) => formatMoney(value, i18n.language)
  const canDecide =
    !!detail &&
    !detailQuery.isError &&
    detail.requestId === item.requestId &&
    detail.step.id === item.stepId &&
    detail.step.state === 'PENDING' &&
    !detail.decision

  return (
    <View style={styles.stack}>
      <Pressable
        accessibilityRole='button'
        accessibilityState={{ disabled: decision.isPending }}
        disabled={decision.isPending}
        onPress={onBack}
        style={styles.back}
      >
        <Text style={styles.backText}>{t('spending.backToQueue')}</Text>
      </Pressable>

      <View style={styles.hero}>
        <Text style={styles.kicker}>{t('spending.detail.spendKicker')}</Text>
        <Text accessibilityRole='header' style={styles.title}>
          {name}
        </Text>
        {item.plan ? <Text style={detailStyles.muted}>{t('spending.plan', { plan: item.plan.planName })}</Text> : null}
        <View style={styles.chips}>
          {item.outcome ? (
            <StatusChip label={t(`spending.outcome.${item.outcome}`)} tone={outcomeTone(item.outcome)} />
          ) : null}
          {item.routing.mode === 'ONE_STEP' ? <StatusChip label={t('spending.routing.oneStep')} /> : null}
        </View>
      </View>

      {detailQuery.isLoading ? (
        <Text accessibilityRole='progressbar' style={detailStyles.muted}>
          {t('spending.loading')}
        </Text>
      ) : null}
      {detailQuery.isError ? (
        <DetailCard>
          <Text accessibilityRole='alert' style={detailStyles.error}>
            {t('spending.detail.error')}
          </Text>
          <Pressable accessibilityRole='button' onPress={() => void detailQuery.refetch()} style={styles.back}>
            <Text style={styles.backText}>{t('spending.retry')}</Text>
          </Pressable>
        </DetailCard>
      ) : null}

      {detail ? (
        <>
          <DetailCard title={t('spending.detail.request')}>
            <Field label={t('spending.detail.reference')} value={detail.requestId} />
            <Field label={t('spending.detail.requester')} value={detail.request.requester.fullName} />
            {detail.request.beneficiary ? (
              <Field label={t('spending.detail.beneficiary')} value={detail.request.beneficiary.fullName} />
            ) : null}
            <Field label={t('spending.detail.costCenter')} value={detail.request.costCenter.code} />
            <Field
              label={t('spending.detail.term')}
              value={
                detail.request.termMonths !== null
                  ? t('spending.months', { count: detail.request.termMonths })
                  : (formatDate(detail.request.expectedEndDate, i18n.language) ?? t('spending.noTerm'))
              }
            />
            <Field label={t('spending.detail.reason')} value={detail.request.businessReason} />
            <Field
              label={t('spending.detail.due')}
              value={formatDate(item.dueOn, i18n.language) ?? t('spending.dateUnavailable')}
            />
          </DetailCard>

          <DetailCard title={t('spending.detail.cost')}>
            {detail.cost ? (
              <>
                <Field
                  emphasized
                  label={t('spending.detail.estimatedCost')}
                  value={money(detail.cost.estimatedCost) ?? t('spending.costUnavailable')}
                />
                <Field
                  label={t('spending.detail.preTax')}
                  value={money(detail.cost.preTax) ?? t('spending.costUnavailable')}
                />
                <Field
                  label={t('spending.detail.tax')}
                  value={money(detail.cost.tax) ?? t('spending.costUnavailable')}
                />
                <Field
                  label={t('spending.detail.totalPayable')}
                  value={money(detail.cost.totalPayable) ?? t('spending.costUnavailable')}
                />
                {detail.cost.label === 'ESTIMATE_NO_PROFILE' ? (
                  <Text style={detailStyles.muted}>{t('spending.detail.noProfile')}</Text>
                ) : null}
              </>
            ) : (
              <Text style={detailStyles.muted}>{t('spending.costUnavailable')}</Text>
            )}
          </DetailCard>

          {detail.assessment ? (
            <DetailCard title={t('spending.detail.assessment')}>
              {detail.assessment.classification ? (
                <Field
                  label={t('spending.detail.classification')}
                  value={t(`spending.classification.${detail.assessment.classification}`)}
                />
              ) : null}
              {detail.assessment.controlLevel ? (
                <Field
                  label={t('spending.detail.controlLevel')}
                  value={t(`spending.controlLevel.${detail.assessment.controlLevel}`)}
                />
              ) : null}
              {detail.assessment.controlRiskNote ? (
                <Field label={t('spending.detail.riskNote')} value={detail.assessment.controlRiskNote} />
              ) : null}
            </DetailCard>
          ) : null}

          {detail.need ? (
            <DetailCard title={t('spending.detail.needDecided')}>
              <Field
                label={t('spending.detail.decidedAt')}
                value={formatDate(detail.need.decidedAt, i18n.language) ?? t('spending.dateUnavailable')}
              />
              {detail.need.reason ? <Field label={t('spending.detail.reason')} value={detail.need.reason} /> : null}
            </DetailCard>
          ) : null}
        </>
      ) : null}

      {detail ? <BudgetSnapshotCard snapshot={detail.budgetSnapshot} /> : null}

      <DetailCard>
        <DecisionPanel
          approveBlocked={
            (detail?.budgetSnapshot?.outcome ?? item.outcome) === 'BLOCKED'
              ? t('spending.detail.budgetBlocked')
              : undefined
          }
          canDecide={canDecide}
          errorKey={decision.isError ? decisionErrorKey(decision.error) : undefined}
          onSubmit={(choice, reason) =>
            decision.mutate({
              id: item.requestId,
              body: choice === 'APPROVE' ? { decision: choice } : { decision: choice, reason }
            })
          }
          pending={decision.isPending}
          succeeded={decision.isSuccess}
        />
      </DetailCard>
    </View>
  )
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', justifyContent: 'center', minHeight: 44 },
  backText: { color: mobileColors.primaryInk, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  hero: { gap: 4 },
  kicker: {
    color: mobileColors.primaryInk,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  stack: { gap: 14 },
  title: { color: mobileColors.foreground, fontSize: 25, fontWeight: '700', letterSpacing: -0.5 }
})

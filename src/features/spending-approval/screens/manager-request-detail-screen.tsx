import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import type { NeedQueueResponseDtoDataItemsItem } from '@/shared/api/generated/model/need-decisions'
import { mobileColors } from '@/shared/theme/colors'

import { DecisionPanel } from '../components/decision-panel'
import { DetailCard, detailStyles, Field } from '../components/detail-parts'
import { StatusChip } from '../components/status-chip'
import { useManagerRequestApprovals } from '../hooks/use-manager-request-approvals'
import { formatDate, formatMoney } from '../model/spending-approvals'

interface ManagerRequestDetailProps {
  item: NeedQueueResponseDtoDataItemsItem
  onBack: () => void
}

export function ManagerRequestDetail({ item, onBack }: ManagerRequestDetailProps) {
  const { i18n, t } = useTranslation()
  const { detail: detailQuery, decision } = useManagerRequestApprovals(1, item.requestId, true)
  const request = detailQuery.data
  const name = item.plan?.applicationName ?? item.softwareName ?? t('spending.unnamed')
  const longTerm = !!request && (request.termMonths ?? 0) > 12
  const canDecide =
    !!request &&
    !detailQuery.isError &&
    request.id === item.requestId &&
    request.type === 'GRANT' &&
    request.needStep.id === item.stepId &&
    request.needStep.state === 'PENDING' &&
    !request.needDecision
  const cost =
    request?.pricing.status === 'NOT_APPLICABLE'
      ? t('spending.manager.costNotApplicable')
      : request?.pricing.status === 'MISSING'
        ? t('spending.manager.costMissing')
        : (formatMoney(request?.pricing.amount, i18n.language) ?? t('spending.costUnavailable'))

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
        <Text style={styles.kicker}>{t('spending.detail.managerKicker')}</Text>
        <Text accessibilityRole='header' style={styles.title}>
          {name}
        </Text>
        {item.plan ? <Text style={detailStyles.muted}>{t('spending.plan', { plan: item.plan.planName })}</Text> : null}
        <View style={styles.chips}>
          <StatusChip label={t('spending.manager.oneStep')} tone='neutral' />
        </View>
        <Text style={detailStyles.muted}>{t('spending.manager.sodNote')}</Text>
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

      {request ? (
        <DetailCard title={t('spending.detail.request')}>
          <Field label={t('spending.detail.reference')} value={request.id} />
          <Field label={t('spending.detail.requester')} value={request.requester.fullName} />
          {request.beneficiary ? (
            <Field label={t('spending.detail.beneficiary')} value={request.beneficiary.fullName} />
          ) : null}
          <Field label={t('spending.manager.department')} value={request.department.name} />
          <Field label={t('spending.detail.reason')} value={request.businessReason} />
          <Field
            label={t('spending.detail.term')}
            value={
              request.termMonths !== null
                ? t('spending.months', { count: request.termMonths })
                : (formatDate(request.expectedEndDate, i18n.language) ?? t('spending.noTerm'))
            }
          />
          <Field emphasized label={t('spending.detail.cost')} value={cost} />
          <Field
            label={t('spending.detail.due')}
            value={formatDate(item.dueOn, i18n.language) ?? t('spending.dateUnavailable')}
          />
        </DetailCard>
      ) : null}

      <DetailCard>
        <DecisionPanel
          approveBlocked={longTerm ? t('spending.manager.longTermBlocked') : undefined}
          canDecide={canDecide}
          errorKey={decision.isError ? 'uncertain' : undefined}
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

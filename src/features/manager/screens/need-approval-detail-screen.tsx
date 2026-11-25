import { Redirect, useRouter } from 'expo-router'
import { useEffect } from 'react'
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

import { createNeedApprovalStyles } from '../components/need-approval-styles'
import { SimilarSeats } from '../components/similar-seats'
import { useAssignedNeedApproval, useNeedApproval } from '../hooks/use-live-need-approvals'
import { isDecidableNeedType } from '../model/group-need-decision.model'
import { formatCost, isOpenNeedStep } from '../model/need-decision.model'

// One assigned request: who asks for what and why, plus similar access they already hold. The decision is a
// separate screen. A reminder for a request that is not (or no longer) in the queue opens the plain request detail.
export function NeedApprovalDetailScreen({ requestId, source }: { requestId: string; source?: 'reminder' }) {
  const { colors: mobileColors } = useMobileTheme()
  const styles = createNeedApprovalStyles(mobileColors)
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const session = useSession()
  const profile = useAccountProfile()
  const isManager = !!profile.data?.roles.includes('MANAGER') && !profile.isError
  const hasScope = isManager && !!profile.data?.managerScope
  const assigned = useAssignedNeedApproval(requestId, hasScope)
  const item = assigned.data
  const decidable = !!item && isDecidableNeedType(item.type) && item.stepKind === 'NEED'
  const { detail } = useNeedApproval(decidable ? requestId : undefined, hasScope)
  const request = detail.data
  const open = !!item && !!request && !detail.isError && isOpenNeedStep(request, item)
  const fallBackToRequest = source === 'reminder' && assigned.isSuccess && !assigned.isFetching && !item

  useEffect(() => {
    if (fallBackToRequest) router.replace({ pathname: '/live-requests/[requestId]', params: { requestId } })
  }, [fallBackToRequest, requestId, router])

  if (session.state === 'anonymous') return <Redirect href='/' />
  if (profile.data && !profile.isError && !isManager) return <Redirect href='/my-software' />

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton label={t('common.back')} onPress={() => goBackOr(router, '/live-need-approvals')} />
        {profile.isError ? (
          <Text accessibilityRole='alert' style={styles.error}>
            {t('manager.live.profileError')}
          </Text>
        ) : isManager && !hasScope ? (
          <Text accessibilityRole='alert' style={styles.error}>
            {t('manager.live.noScope')}
          </Text>
        ) : !hasScope || assigned.isPending || (decidable && detail.isPending) || fallBackToRequest ? (
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
            <View style={styles.titleBlock}>
              <Text accessibilityRole='header' style={styles.pageTitle}>
                {request.plan?.applicationName ?? request.proposal?.softwareName ?? t('requests.live.unnamed')}
              </Text>
              {request.plan ? (
                <Text style={styles.muted}>{t('licenses.live.plan', { plan: request.plan.planName })}</Text>
              ) : null}
            </View>
            {!open ? (
              <Text accessibilityRole='alert' style={styles.error}>
                {t('manager.live.stale')}
              </Text>
            ) : null}
            <View style={styles.card}>
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
              <Text style={styles.label}>{t('manager.live.cost')}</Text>
              <Text style={styles.value}>
                {request.pricing.status === 'NOT_APPLICABLE'
                  ? t('manager.live.costNotApplicable')
                  : request.pricing.status === 'MISSING'
                    ? t('manager.live.costMissing')
                    : (formatCost(request.pricing.amount, i18n.language) ?? t('manager.live.costUnavailable'))}
              </Text>
            </View>
            {request.type !== 'GROUP_GRANT' ? (
              <View style={styles.card}>
                <SimilarSeats requestId={request.id} />
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
      {open ? (
        <View style={styles.footer}>
          <PressableFeedback
            accessibilityRole='button'
            onPress={() => router.push({ pathname: '/live-need-approvals/[requestId]/decide', params: { requestId } })}
            style={styles.primary}
          >
            <Text style={styles.primaryText}>{t('manager.live.makeDecision')}</Text>
          </PressableFeedback>
        </View>
      ) : null}
    </SafeAreaView>
  )
}

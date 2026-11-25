import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useSession } from '@/shared/api/session-context'
import { useAccountProfile } from '@/shared/api/use-account-profile'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { EmptyState } from '@/shared/ui/empty-state'
import { LoadingState } from '@/shared/ui/loading-state'
import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import { RefreshStatus, useRefreshFeedback } from '@/shared/ui/refresh-status'
import { Pagination } from '@/shared/ui/pagination'

import { createNeedApprovalStyles } from '../components/need-approval-styles'
import { NeedQueueCard } from '../components/need-queue-card'
import { useNeedQueue } from '../hooks/use-live-need-approvals'

// Tab root of the Manager: the assigned need-approval queue. Opening an item pushes its own detail screen.
export function LiveNeedApprovalsScreen() {
  const { colors: mobileColors } = useMobileTheme()
  const styles = createNeedApprovalStyles(mobileColors)
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const session = useSession()
  const [page, setPage] = useState(1)
  const listScroll = useRef<ScrollView>(null)
  const queueRefresh = useRefreshFeedback()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState(false)
  const profile = useAccountProfile()
  const isManager = !!profile.data?.roles.includes('MANAGER') && !profile.isError
  const hasScope = isManager && !!profile.data?.managerScope
  const queue = useNeedQueue(page, hasScope)

  async function logout() {
    if (loggingOut) return
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
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <ScrollView
        ref={listScroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={() => void queueRefresh.refresh(queue.refetch)}
            refreshing={queueRefresh.state === 'loading'}
            tintColor={mobileColors.primary}
          />
        }
      >
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
        {profile.isError ? (
          <View>
            <Text accessibilityRole='alert' style={styles.error}>
              {t('manager.live.profileError')}
            </Text>
            <PressableFeedback accessibilityRole='button' onPress={() => void profile.refetch()} style={styles.action}>
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
        {isManager ? (
          <View style={styles.queueHeader}>
            <View style={styles.titleBlock}>
              <Text accessibilityRole='header' style={styles.pageTitle}>
                {t('manager.live.title')}
              </Text>
              <Text style={styles.muted}>
                {hasScope && queue.data
                  ? t('manager.live.assignedCount', {
                      count: queue.data.pagination.totalItems,
                      formattedCount: new Intl.NumberFormat(i18n.language).format(queue.data.pagination.totalItems)
                    })
                  : t('manager.live.scope')}
              </Text>
            </View>
            {hasScope ? (
              <PressableFeedback
                accessibilityLabel={t('manager.live.refreshQueue')}
                accessibilityRole='button'
                accessibilityState={{ busy: queue.isFetching }}
                disabled={queue.isFetching || queueRefresh.state === 'loading'}
                onPress={() => void queueRefresh.refresh(queue.refetch)}
                style={styles.iconButton}
              >
                <Feather
                  accessibilityElementsHidden
                  color={mobileColors.primaryInk}
                  importantForAccessibility='no'
                  name='refresh-cw'
                  size={17}
                />
              </PressableFeedback>
            ) : null}
          </View>
        ) : null}
        {isManager ? (
          <>
            <RefreshStatus
              failedLabel={t('common.refreshFailed')}
              doneLabel={t('common.refreshed')}
              loadingLabel={t('common.refreshing')}
              state={queueRefresh.state}
            />
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
                  <PressableFeedback accessibilityRole='button' onPress={() => setPage(page - 1)} style={styles.action}>
                    <Text style={styles.link}>{t('licenses.live.previous')}</Text>
                  </PressableFeedback>
                ) : null}
              </View>
            ) : null}
            {hasScope && queue.data?.items.length === 0 ? <EmptyState title={t('manager.live.empty')} /> : null}
            {hasScope &&
              queue.data?.items.map((item) => (
                <NeedQueueCard
                  key={item.stepId}
                  item={item}
                  onPress={(selected) =>
                    router.push({
                      pathname: '/live-need-approvals/[requestId]',
                      params: { requestId: selected.requestId }
                    })
                  }
                />
              ))}
            {hasScope && queue.data && queue.data.pagination.totalPages > 1 ? (
              <Pagination
                onChange={(next) => {
                  setPage(next)
                  listScroll.current?.scrollTo({ y: 0, animated: true })
                }}
                page={page}
                totalPages={queue.data.pagination.totalPages}
              />
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}

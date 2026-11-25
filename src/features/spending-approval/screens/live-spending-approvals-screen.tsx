import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useSession } from '@/shared/api/session-context'
import { useAccountProfile } from '@/shared/api/use-account-profile'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { EmptyState } from '@/shared/ui/empty-state'
import { LoadingState } from '@/shared/ui/loading-state'
import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import { RefreshStatus, useRefreshFeedback } from '@/shared/ui/refresh-status'

import { LiveSpendingApprovalCard } from '../components/live-spending-approval-card'
import { ActionButton, createSpendingStyles } from '../components/spending-approval-parts'
import { useSpendingQueue } from '../hooks/use-live-spending-approvals'
import { filterSpendApprovals } from '../model/live-spending-approvals'

// Tab root of the Spending Approver: the assigned queue. Opening an item pushes its own detail screen.
export function LiveSpendingApprovalsScreen() {
  const { colors } = useMobileTheme()
  const styles = createSpendingStyles(colors)
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const session = useSession()
  const profile = useAccountProfile()
  const account = profile.data
  const isApprover = account?.roles.length === 1 && account.roles[0] === 'SPENDING_APPROVER'
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const queueRefresh = useRefreshFeedback()
  const queue = useSpendingQueue(page, !!isApprover)
  const items = queue.data?.items
  const filteredItems = useMemo(() => filterSpendApprovals(items ?? [], search), [items, search])

  if (session.state === 'anonymous') return <Redirect href='/' />
  if (session.state === 'authenticated' && account && !isApprover) return <Redirect href='/home' />

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
        refreshControl={
          <RefreshControl
            onRefresh={() => void queueRefresh.refresh(queue.refetch)}
            refreshing={queueRefresh.state === 'loading'}
            tintColor={colors.primary}
          />
        }
      >
        {profile.isError ? (
          <View style={styles.notice}>
            <Text accessibilityRole='alert' style={styles.bodyText}>
              {t('spending.live.profileError')}
            </Text>
            <ActionButton label={t('account.retry')} onPress={() => void profile.refetch()} />
          </View>
        ) : !account ? (
          <Text accessibilityRole='progressbar' style={styles.muted}>
            {t('account.loading')}
          </Text>
        ) : null}

        {profile.isError || !account || !isApprover ? null : (
          <>
            <View style={styles.queueHeader}>
              <View style={styles.flex}>
                <Text accessibilityRole='header' style={styles.title}>
                  {t('spending.live.title')}
                </Text>
                <Text style={styles.muted}>
                  {queue.data
                    ? t('spending.live.queueCount', {
                        count: queue.data.pagination.totalItems,
                        formattedCount: new Intl.NumberFormat(i18n.language).format(queue.data.pagination.totalItems)
                      })
                    : t('spending.live.assignedOnly')}
                </Text>
              </View>
              <PressableFeedback
                accessibilityRole='button'
                accessibilityLabel={t('spending.live.refreshQueue')}
                accessibilityState={{ busy: queue.isFetching }}
                disabled={queue.isFetching || queueRefresh.state === 'loading'}
                onPress={() => void queueRefresh.refresh(queue.refetch)}
                style={styles.iconButton}
              >
                <Feather
                  accessibilityElementsHidden
                  color={colors.primaryInk}
                  importantForAccessibility='no'
                  name='refresh-cw'
                  size={17}
                />
              </PressableFeedback>
            </View>
            <RefreshStatus
              failedLabel={t('common.refreshFailed')}
              doneLabel={t('common.refreshed')}
              loadingLabel={t('common.refreshing')}
              state={queueRefresh.state}
            />
            {queue.isError ? (
              <View style={styles.notice}>
                <Text accessibilityRole='alert' style={styles.bodyText}>
                  {t('spending.live.queueError')}
                </Text>
                <ActionButton label={t('account.retry')} onPress={() => void queue.refetch()} />
              </View>
            ) : null}
            <View style={styles.search}>
              <Feather
                accessibilityElementsHidden
                color={colors.muted}
                importantForAccessibility='no'
                name='search'
                size={17}
              />
              <TextInput
                accessibilityLabel={t('spending.live.searchLabel')}
                onChangeText={setSearch}
                placeholder={t('spending.live.searchPlaceholder')}
                placeholderTextColor={colors.muted}
                returnKeyType='search'
                style={styles.searchInput}
                value={search}
              />
            </View>
            {queue.isPending ? (
              <LoadingState label={t('spending.live.queueLoading')} />
            ) : filteredItems.length ? (
              <View style={styles.list}>
                {filteredItems.map((item) => (
                  <LiveSpendingApprovalCard
                    key={item.requestId}
                    item={item}
                    onPress={(requestId) =>
                      router.push({ pathname: '/spending-approvals/[requestId]', params: { requestId } })
                    }
                  />
                ))}
              </View>
            ) : (
              <EmptyState
                hint={search ? t('spending.live.emptySearchHint') : t('spending.live.emptyQueueHint')}
                title={search ? t('spending.live.emptySearch') : t('spending.live.emptyQueue')}
              />
            )}
            {queue.data && queue.data.pagination.totalPages > 1 ? (
              <View style={styles.pagination}>
                <ActionButton
                  disabled={page <= 1 || queue.isFetching}
                  label={t('spending.live.previousPage')}
                  onPress={() => setPage((current) => Math.max(1, current - 1))}
                />
                <Text style={styles.muted}>
                  {t('spending.live.page', {
                    page: queue.data.pagination.page,
                    totalPages: queue.data.pagination.totalPages
                  })}
                </Text>
                <ActionButton
                  disabled={page >= queue.data.pagination.totalPages || queue.isFetching}
                  label={t('spending.live.nextPage')}
                  onPress={() => setPage((current) => current + 1)}
                />
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

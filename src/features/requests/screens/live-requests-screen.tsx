import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

import { SoftwareIcon } from '@/entities/software'
import { EmptyState } from '@/shared/ui/empty-state'
import { RefreshStatus, useRefreshFeedback } from '@/shared/ui/refresh-status'
import { LoadingState } from '@/shared/ui/loading-state'
import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import { SegmentedControl } from '@/shared/ui/segmented-control'
import { mayCreateRequest } from '@/shared/api/request-eligibility'
import { useSession } from '@/shared/api/session-context'
import { useAccountProfile } from '@/shared/api/use-account-profile'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { LiveRequestStatus } from '../components/live-request-status'
import { LiveRequestType } from '../components/live-request-type'
import { useLiveRequests } from '../hooks/use-live-requests'

export function LiveRequestsScreen() {
  const { colors: mobileColors } = useMobileTheme()
  const styles = createStyles(mobileColors)
  const { t, i18n } = useTranslation()
  const pull = useRefreshFeedback()
  const router = useRouter()
  const session = useSession()
  const profile = useAccountProfile()
  const [view, setView] = useState<'open' | 'ended'>('open')
  const [page, setPage] = useState(1)
  const query = useLiveRequests(view, page)

  if (session.state === 'anonymous') return <Redirect href='/' />
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              onRefresh={() =>
                void pull.refresh(async () => {
                  const results = await Promise.all([query.refetch()])
                  return { isError: results.some((result) => result.isError) }
                })
              }
              refreshing={pull.state === 'loading'}
              tintColor={mobileColors.primary}
            />
          }
        >
          <RefreshStatus
            doneLabel={t('common.refreshed')}
            failedLabel={t('common.refreshFailed')}
            loadingLabel={t('common.refreshing')}
            showLoading={false}
            state={pull.state}
          />
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <Text accessibilityRole='header' style={styles.pageTitle}>
                {t('requests.title')}
              </Text>
              <Text style={styles.muted}>{t('requests.live.subtitle')}</Text>
            </View>
            {!profile.isError && mayCreateRequest(profile.data) ? (
              <PressableFeedback
                accessibilityRole='button'
                accessibilityLabel={t('navigation.createRequest')}
                onPress={() => router.push('/live-request-create')}
                style={styles.createButton}
              >
                <Feather
                  accessibilityElementsHidden
                  importantForAccessibility='no'
                  name='plus'
                  size={18}
                  color={mobileColors.onPrimary}
                />
                <Text style={styles.createText}>{t('requests.live.createShort')}</Text>
              </PressableFeedback>
            ) : null}
          </View>
          <SegmentedControl
            onChange={(value) => {
              setView(value)
              setPage(1)
            }}
            options={(['open', 'ended'] as const).map((value) => ({
              label: t(`requests.live.views.${value}`),
              value
            }))}
            value={view}
          />
          {session.state === 'loading' || query.isLoading ? <LoadingState label={t('requests.live.loading')} /> : null}
          {query.isError ? (
            <View style={styles.card}>
              <Text accessibilityRole='alert' style={styles.error}>
                {t('requests.live.listError')}
              </Text>
              <PressableFeedback accessibilityRole='button' onPress={() => void query.refetch()} style={styles.action}>
                <Text style={styles.actionText}>{t('licenses.live.retry')}</Text>
              </PressableFeedback>
              {page > 1 ? (
                <PressableFeedback accessibilityRole='button' onPress={() => setPage(page - 1)} style={styles.action}>
                  <Text style={styles.actionText}>{t('licenses.live.previous')}</Text>
                </PressableFeedback>
              ) : null}
            </View>
          ) : null}
          {query.data?.items.length === 0 ? <EmptyState title={t('requests.live.empty')} /> : null}
          {query.data?.items.map((item) => {
            const name = item.plan?.applicationName ?? item.softwareName ?? t('requests.live.unnamed')
            const date = new Date(item.submittedAt)
            return (
              <View key={item.id} style={styles.card}>
                <PressableFeedback
                  accessibilityRole='button'
                  accessibilityLabel={t('requests.live.openNamed', { name })}
                  onPress={() =>
                    router.push({ pathname: '/live-requests/[requestId]', params: { requestId: item.id } })
                  }
                >
                  <View style={styles.row}>
                    <SoftwareIcon name={name} />
                    <View style={styles.itemHeading}>
                      <Text style={styles.itemTitle}>{name}</Text>
                      {item.plan ? (
                        <Text style={styles.muted}>{t('licenses.live.plan', { plan: item.plan.planName })}</Text>
                      ) : null}
                    </View>
                    <Feather
                      accessibilityElementsHidden
                      importantForAccessibility='no'
                      name='chevron-right'
                      size={20}
                      color={mobileColors.muted}
                    />
                  </View>
                  <View style={styles.statusRow}>
                    <LiveRequestType type={item.type} />
                    <LiveRequestStatus state={item.state} />
                  </View>
                  {item.involvement === 'FOR_ME' ? <Text style={styles.muted}>{t('requests.live.forMe')}</Text> : null}
                  <Text style={styles.muted}>
                    {t('requests.live.submitted', {
                      date: Number.isNaN(date.getTime())
                        ? t('licenses.live.dateUnavailable')
                        : new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }).format(date)
                    })}
                  </Text>
                </PressableFeedback>
              </View>
            )
          })}
          {query.data && query.data.pagination.totalPages > 1 ? (
            <View style={styles.pagination}>
              <PressableFeedback
                accessibilityRole='button'
                accessibilityState={{ disabled: page <= 1 }}
                disabled={page <= 1}
                onPress={() => setPage(page - 1)}
                style={[styles.action, page <= 1 && styles.disabled]}
              >
                <Text style={styles.actionText}>{t('licenses.live.previous')}</Text>
              </PressableFeedback>
              <Text style={styles.muted}>
                {t('licenses.live.page', { page: new Intl.NumberFormat(i18n.language).format(page) })}
              </Text>
              <PressableFeedback
                accessibilityRole='button'
                accessibilityState={{ disabled: page >= query.data.pagination.totalPages }}
                disabled={page >= query.data.pagination.totalPages}
                onPress={() => setPage(page + 1)}
                style={[styles.action, page >= query.data.pagination.totalPages && styles.disabled]}
              >
                <Text style={styles.actionText}>{t('licenses.live.next')}</Text>
              </PressableFeedback>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const createStyles = (mobileColors: MobileColors) =>
  StyleSheet.create({
    titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
    titleBlock: { flex: 1, gap: 4 },
    pageTitle: { color: mobileColors.foreground, fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
    createButton: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      borderCurve: 'continuous',
      borderRadius: 14,
      backgroundColor: mobileColors.primary
    },
    createText: { color: mobileColors.onPrimary, fontWeight: '700' },
    safe: { flex: 1, backgroundColor: mobileColors.background },
    screen: { flex: 1 },
    content: { padding: 20, paddingBottom: 24, gap: 14 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 20,
      borderCurve: 'continuous',
      borderRadius: 22,
      backgroundColor: mobileColors.primarySoft
    },
    heading: { flex: 1, gap: 5 },
    kicker: {
      color: mobileColors.primaryInk,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase'
    },
    title: { color: mobileColors.foreground, fontSize: 25, fontWeight: '700' },
    headerSubtitle: { color: mobileColors.foreground, fontSize: 13, lineHeight: 19 },
    muted: { color: mobileColors.muted, fontSize: 13, lineHeight: 19 },
    icon: {
      width: 44,
      height: 44,
      borderCurve: 'continuous',
      borderRadius: 16,
      backgroundColor: mobileColors.surface,
      alignItems: 'center',
      justifyContent: 'center'
    },
    filters: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      backgroundColor: mobileColors.surfaceSubtle,
      padding: 4,
      borderCurve: 'continuous',
      borderRadius: 14
    },
    filter: {
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: 15,
      borderCurve: 'continuous',
      borderRadius: 12
    },
    selected: { backgroundColor: mobileColors.primary },
    filterText: { color: mobileColors.muted, fontWeight: '600', fontSize: 12 },
    selectedText: { color: mobileColors.onPrimary },
    card: {
      backgroundColor: mobileColors.white,
      borderColor: mobileColors.border,
      borderWidth: 1,
      borderCurve: 'continuous',
      borderRadius: 20,
      padding: 18,
      gap: 9
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
    itemHeading: { flex: 1, minWidth: 0, gap: 3 },
    statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
    itemTitle: { color: mobileColors.foreground, fontWeight: '700', fontSize: 16 },
    error: { color: mobileColors.danger, fontSize: 13 },
    action: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8, alignSelf: 'flex-start' },
    actionText: { color: mobileColors.primaryInk, fontWeight: '700' },
    disabled: { opacity: 0.4 },
    pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
  })

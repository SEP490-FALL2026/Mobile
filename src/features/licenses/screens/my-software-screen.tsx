import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { EmptyState } from '@/shared/ui/empty-state'
import { RefreshStatus, useRefreshFeedback } from '@/shared/ui/refresh-status'
import { LoadingState } from '@/shared/ui/loading-state'
import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import { SegmentedControl } from '@/shared/ui/segmented-control'
import { useSession } from '@/shared/api/session-context'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { LiveSoftwareCard } from '../components/live-software-card'
import { useMySoftware } from '../hooks/use-my-software'

export function MySoftwareScreen() {
  const { colors: mobileColors } = useMobileTheme()
  const styles = createStyles(mobileColors)
  const { t, i18n } = useTranslation()
  const pull = useRefreshFeedback()
  const session = useSession()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'current' | 'ended'>('current')
  const [filter, setFilter] = useState<'all' | 'expiring'>('all')
  const { profile, software, summary } = useMySoftware(page, view)
  const items = software.data?.items.filter((item) => filter === 'all' || item.expiringSoon) ?? []
  const expiring = summary.data?.expiringRights
  const expiringCount = expiring?.state === 'COUNTED' && expiring.count !== null ? expiring.count : undefined
  const currentSummary = summary.data?.softwareRights
  const currentCount =
    view === 'current'
      ? software.data?.pagination.totalItems
      : currentSummary?.state === 'COUNTED' && currentSummary.count !== null
        ? currentSummary.count
        : undefined
  const formatCount = (value: number) => new Intl.NumberFormat(i18n.language).format(value)

  if (session.state === 'anonymous') return <Redirect href='/' />

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              onRefresh={() =>
                void pull.refresh(async () => {
                  const results = await Promise.all([software.refetch(), summary.refetch()])
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
          <View style={styles.titleBlock}>
            <Text accessibilityRole='header' style={styles.pageTitle}>
              {t('licenses.screenTitle')}
            </Text>
            <Text style={styles.subtitle}>{t('licenses.live.description')}</Text>
          </View>

          <View style={styles.summary}>
            <View style={[styles.summaryCard, styles.summaryPrimary]}>
              <View style={styles.summaryIcon}>
                <Feather
                  accessibilityElementsHidden
                  importantForAccessibility='no'
                  name='grid'
                  size={16}
                  color={mobileColors.primaryInk}
                />
              </View>
              <Text style={styles.summaryValue}>
                {currentCount !== undefined
                  ? t('licenses.live.total', {
                      count: currentCount,
                      formattedCount: formatCount(currentCount)
                    })
                  : t('licenses.live.countUnavailable')}
              </Text>
              <Text style={styles.summaryLabel}>{t('licenses.live.currentRights')}</Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryWarning]}>
              <View style={[styles.summaryIcon, styles.summaryIconWarning]}>
                <Feather
                  accessibilityElementsHidden
                  importantForAccessibility='no'
                  name='clock'
                  size={16}
                  color={mobileColors.warning}
                />
              </View>
              <Text style={styles.summaryValue}>
                {expiringCount !== undefined
                  ? t('licenses.live.expiringTotal', {
                      count: expiringCount,
                      formattedCount: formatCount(expiringCount)
                    })
                  : t('licenses.live.countUnavailable')}
              </Text>
              <Text style={styles.summaryLabel}>{t('licenses.live.expiringLabel')}</Text>
            </View>
          </View>
          {summary.isError ? (
            <PressableFeedback
              accessibilityRole='button'
              onPress={() => void summary.refetch()}
              style={styles.retryInline}
            >
              <Text accessibilityRole='alert' style={styles.subtitle}>
                {t('licenses.live.summaryError')}
              </Text>
              <Text style={styles.buttonText}>{t('licenses.live.retry')}</Text>
            </PressableFeedback>
          ) : null}

          <View style={styles.sectionHeading}>
            <Text accessibilityRole='header' style={styles.sectionTitle}>
              {t('licenses.listTitle')}
            </Text>
          </View>
          <SegmentedControl
            onChange={(value) => {
              setView(value)
              setPage(1)
              setFilter('all')
            }}
            options={(['current', 'ended'] as const).map((value) => ({
              label: t(`licenses.live.views.${value}`),
              value
            }))}
            value={view}
          />
          {view === 'current' ? (
            <View accessibilityLabel={t('licenses.filterLabel')} style={styles.filters}>
              {(['all', 'expiring'] as const).map((value) => (
                <PressableFeedback
                  key={value}
                  accessibilityRole='button'
                  accessibilityState={{ selected: filter === value }}
                  onPress={() => setFilter(value)}
                  style={({ pressed }) => [
                    styles.filterButton,
                    filter === value && styles.filterSelected,
                    pressed && styles.pressed
                  ]}
                >
                  <Text style={[styles.filterText, filter === value && styles.filterTextSelected]}>
                    {t(`licenses.listFilters.${value}`)}
                  </Text>
                </PressableFeedback>
              ))}
            </View>
          ) : null}
          {filter === 'expiring' ? <Text style={styles.subtitle}>{t('licenses.live.pageFilterNote')}</Text> : null}
          {session.state === 'loading' || profile.isLoading || software.isLoading ? (
            <LoadingState label={t('licenses.live.loading')} />
          ) : null}
          {profile.isError || software.isError ? (
            <View style={styles.messageCard}>
              <Text accessibilityRole='alert' style={styles.subtitle}>
                {t('licenses.live.error')}
              </Text>
              <PressableFeedback
                accessibilityRole='button'
                onPress={() => {
                  if (profile.isError) void profile.refetch()
                  if (software.isError) void software.refetch()
                }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{t('licenses.live.retry')}</Text>
              </PressableFeedback>
              {page > 1 && software.isError ? (
                <PressableFeedback
                  accessibilityRole='button'
                  onPress={() => setPage((current) => current - 1)}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>{t('licenses.live.previous')}</Text>
                </PressableFeedback>
              ) : null}
            </View>
          ) : null}
          {software.data ? (
            <View style={styles.list}>
              {items.map((item) => (
                <LiveSoftwareCard
                  key={item.assignmentId}
                  item={item}
                  onPress={() =>
                    router.push({ pathname: '/my-software/[softwareId]', params: { softwareId: item.assignmentId } })
                  }
                />
              ))}
              {items.length === 0 ? (
                <EmptyState
                  hint={view === 'current' && filter === 'all' && page === 1 ? t('licenses.live.emptyHint') : undefined}
                  title={
                    filter === 'expiring'
                      ? t('licenses.live.noExpiringPage')
                      : view === 'ended'
                        ? t('licenses.live.endedEmpty')
                        : page === 1
                          ? t('licenses.live.empty')
                          : t('licenses.live.emptyPage')
                  }
                />
              ) : null}
              {software.data.pagination.totalPages > 1 ? (
                <View style={styles.pagination}>
                  <PressableFeedback
                    accessibilityRole='button'
                    accessibilityState={{ disabled: page <= 1 }}
                    disabled={page <= 1}
                    onPress={() => setPage((current) => current - 1)}
                    style={[styles.button, page <= 1 && styles.disabledButton]}
                  >
                    <Text style={styles.buttonText}>{t('licenses.live.previous')}</Text>
                  </PressableFeedback>
                  <Text style={styles.subtitle}>{t('licenses.live.page', { page: formatCount(page) })}</Text>
                  <PressableFeedback
                    accessibilityRole='button'
                    accessibilityState={{ disabled: page >= software.data.pagination.totalPages }}
                    disabled={page >= software.data.pagination.totalPages}
                    onPress={() => setPage((current) => current + 1)}
                    style={[styles.button, page >= software.data.pagination.totalPages && styles.disabledButton]}
                  >
                    <Text style={styles.buttonText}>{t('licenses.live.next')}</Text>
                  </PressableFeedback>
                </View>
              ) : null}
            </View>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const createStyles = (mobileColors: MobileColors) =>
  StyleSheet.create({
    safeArea: { backgroundColor: mobileColors.background, flex: 1 },
    screen: { flex: 1 },
    content: { gap: 18, padding: 20, paddingBottom: 28 },
    profile: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    profileCopy: { flex: 1 },
    profileFallback: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8 },
    inboxButton: {
      width: 44,
      height: 44,
      borderCurve: 'continuous',
      borderRadius: 22,
      borderWidth: 1,
      borderColor: mobileColors.border,
      backgroundColor: mobileColors.white,
      alignItems: 'center',
      justifyContent: 'center'
    },
    titleBlock: { gap: 4 },
    pageTitle: { color: mobileColors.foreground, fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
    heading: {
      gap: 8,
      padding: 20,
      borderCurve: 'continuous',
      borderRadius: 22,
      backgroundColor: mobileColors.primarySoft
    },
    headingMain: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    headingCopy: { flex: 1, minWidth: 0, gap: 7 },
    headingIcon: {
      width: 44,
      height: 44,
      borderCurve: 'continuous',
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: mobileColors.surface
    },
    approvalsLink: { minHeight: 44, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 8 },
    kicker: {
      color: mobileColors.primaryInk,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase'
    },
    title: { color: mobileColors.foreground, fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
    subtitle: { color: mobileColors.muted, fontSize: 14, lineHeight: 21 },
    heroSubtitle: { color: mobileColors.foreground },
    summary: { flexDirection: 'row', gap: 9 },
    summaryCard: {
      backgroundColor: mobileColors.white,
      borderColor: mobileColors.border,
      borderCurve: 'continuous',
      borderRadius: 17,
      borderWidth: 1,
      flex: 1,
      gap: 5,
      minHeight: 130,
      padding: 16
    },
    summaryPrimary: { backgroundColor: mobileColors.surfaceSubtle, borderColor: mobileColors.primarySoft },
    summaryWarning: { backgroundColor: mobileColors.warningBackground, borderColor: mobileColors.warningBackground },
    summaryIcon: {
      alignItems: 'center',
      backgroundColor: mobileColors.primarySoft,
      borderCurve: 'continuous',
      borderRadius: 12,
      height: 30,
      justifyContent: 'center',
      marginBottom: 2,
      width: 34
    },
    summaryIconWarning: { backgroundColor: mobileColors.surface },
    summaryValue: { color: mobileColors.foreground, fontSize: 20, fontWeight: '700' },
    summaryLabel: { color: mobileColors.muted, fontSize: 12, lineHeight: 17, fontWeight: '500' },
    sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sectionTitle: { color: mobileColors.foreground, fontSize: 18, fontWeight: '700' },
    filters: {
      alignSelf: 'flex-start',
      backgroundColor: mobileColors.surfaceSubtle,
      borderCurve: 'continuous',
      borderRadius: 14,
      flexDirection: 'row',
      padding: 4
    },
    filterButton: {
      alignItems: 'center',
      borderCurve: 'continuous',
      borderRadius: 12,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: 15
    },
    filterSelected: { backgroundColor: mobileColors.primary },
    filterText: { color: mobileColors.muted, fontSize: 12, fontWeight: '600' },
    filterTextSelected: { color: mobileColors.onPrimary },
    list: { gap: 12 },
    messageCard: {
      backgroundColor: mobileColors.white,
      borderCurve: 'continuous',
      borderRadius: 16,
      padding: 16,
      gap: 8
    },
    emptyCard: {
      alignItems: 'center',
      backgroundColor: mobileColors.white,
      borderColor: mobileColors.border,
      borderWidth: 1,
      borderCurve: 'continuous',
      borderRadius: 16,
      padding: 28,
      gap: 10
    },
    emptyIcon: {
      backgroundColor: mobileColors.primarySoft,
      borderCurve: 'continuous',
      borderRadius: 16,
      height: 48,
      width: 48,
      alignItems: 'center',
      justifyContent: 'center'
    },
    emptyTitle: { color: mobileColors.foreground, fontSize: 14, fontWeight: '700', textAlign: 'center' },
    emptyHint: { color: mobileColors.muted, fontSize: 12, textAlign: 'center', lineHeight: 18 },
    pagination: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    button: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 },
    disabledButton: { opacity: 0.4 },
    pressed: { opacity: 0.7 },
    buttonText: { color: mobileColors.primaryInk, fontWeight: '700' },
    retryInline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 44 }
  })

import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import { useUnreadCount } from '@/shared/api/use-unread-count'
import { mayCreateRequest } from '@/shared/api/request-eligibility'
import { useSession } from '@/shared/api/session-context'
import { useAccountProfile } from '@/shared/api/use-account-profile'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { Avatar } from '@/shared/ui/avatar'
import { IconBadge } from '@/shared/ui/icon-badge'
import { RefreshStatus, useRefreshFeedback } from '@/shared/ui/refresh-status'
import { LoadingState } from '@/shared/ui/loading-state'
import { SentryMascot } from '@/shared/ui/sentry-mascot'

export function LiveHomeScreen() {
  const { t, i18n } = useTranslation()
  const pull = useRefreshFeedback()
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  const router = useRouter()
  const session = useSession()
  const profile = useAccountProfile()
  const count = useUnreadCount()

  if (session.state === 'anonymous') return <Redirect href='/' />
  const account = !profile.isError ? profile.data : undefined
  const role = account?.roles.length === 1 ? account.roles[0] : undefined
  const mayRequest = mayCreateRequest(account)
  const manager = role === 'MANAGER' && !!account?.managerScope
  const tipRole = role === 'MANAGER' ? 'manager' : role === 'SPENDING_APPROVER' ? 'spendingApprover' : 'employee'
  const mascotMessages = [
    t('mascot.hello'),
    t(`mascot.tips.${tipRole}.first`),
    t(`mascot.tips.${tipRole}.second`),
    t('mascot.goodbye')
  ]

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={() =>
              void pull.refresh(async () => {
                const results = await Promise.all([profile.refetch(), count.refetch()])
                return { isError: results.some((result) => result.isError) }
              })
            }
            refreshing={pull.state === 'loading'}
            tintColor={colors.primary}
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
        {account && role ? (
          <>
            <View style={styles.header}>
              <Avatar
                name={account.employee.fullName}
                url={account.avatar?.url}
                size={52}
                onImageError={() => void profile.refetch()}
              />
              <View style={styles.profile}>
                <Text style={styles.eyebrow}>{t('home.live.eyebrow')}</Text>
                <Text accessibilityRole='header' maxFontSizeMultiplier={1.3} numberOfLines={2} style={styles.title}>
                  {t('home.live.greeting', { name: account.employee.fullName })}
                </Text>
                <Text numberOfLines={1} style={styles.subtitle}>
                  {account.employee.department?.name ?? t('licenses.live.noDepartment')}
                </Text>
              </View>
              <SentryMascot interactive={{ label: t('mascot.label'), messages: mascotMessages }} size={64} />
            </View>
            {manager ? (
              <PressableFeedback
                accessibilityRole='button'
                accessibilityLabel={t('manager.live.openQueue')}
                onPress={() => router.push('/live-need-approvals')}
                style={styles.featured}
              >
                <IconBadge name='check-circle' size={48} tone='indigo' />
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{t('manager.live.openQueue')}</Text>
                  <Text style={styles.cardDescription}>{t('home.live.approvalsDescription')}</Text>
                </View>
                <Feather name='chevron-right' size={20} color={colors.muted} />
              </PressableFeedback>
            ) : null}
            {role === 'MANAGER' && !account.managerScope ? (
              <Text accessibilityRole='alert' style={styles.notice}>
                {t('home.live.noManagerScope')}
              </Text>
            ) : null}
            {role === 'SPENDING_APPROVER' ? (
              <PressableFeedback
                accessibilityRole='button'
                accessibilityLabel={t('spending.live.openQueue')}
                onPress={() => router.push('/spending-approvals')}
                style={styles.featured}
              >
                <IconBadge name='credit-card' size={48} tone='indigo' />
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{t('spending.live.openQueue')}</Text>
                  <Text style={styles.cardDescription}>{t('home.live.spendingDescription')}</Text>
                </View>
                <Feather name='chevron-right' size={20} color={colors.muted} />
              </PressableFeedback>
            ) : null}
            <Text accessibilityRole='header' style={styles.sectionTitle}>
              {t('home.live.actions')}
            </Text>
            <View style={styles.grid}>
              <PressableFeedback
                accessibilityRole='button'
                accessibilityLabel={t('home.live.software')}
                accessibilityHint={t('home.live.softwareDescription')}
                onPress={() => router.push('/my-software')}
                style={[styles.tile, { backgroundColor: colors.tones.blue.soft }]}
              >
                <IconBadge name='squares-four' tone='blue' />
                <Text numberOfLines={2} style={styles.tileLabel}>
                  {t('home.live.software')}
                </Text>
              </PressableFeedback>
              {mayRequest ? (
                <PressableFeedback
                  accessibilityRole='button'
                  accessibilityLabel={t('navigation.createRequest')}
                  accessibilityHint={t('home.live.createDescription')}
                  onPress={() => router.push('/live-request-create')}
                  style={[styles.tile, { backgroundColor: colors.tones.orange.soft }]}
                >
                  <IconBadge name='plus-circle' tone='orange' />
                  <Text numberOfLines={2} style={styles.tileLabel}>
                    {t('navigation.createRequest')}
                  </Text>
                </PressableFeedback>
              ) : null}
              {role !== 'SPENDING_APPROVER' ? (
                <PressableFeedback
                  accessibilityRole='button'
                  accessibilityLabel={t('home.live.requests')}
                  accessibilityHint={t('home.live.requestsDescription')}
                  onPress={() => router.push('/live-requests')}
                  style={[styles.tile, { backgroundColor: colors.tones.teal.soft }]}
                >
                  <IconBadge name='file-text' tone='teal' />
                  <Text numberOfLines={2} style={styles.tileLabel}>
                    {t('home.live.requests')}
                  </Text>
                </PressableFeedback>
              ) : null}
              <PressableFeedback
                accessibilityRole='button'
                accessibilityLabel={t('navigation.inbox')}
                accessibilityHint={
                  count.data !== undefined
                    ? t('home.live.unread', {
                        count: count.data,
                        formattedCount: new Intl.NumberFormat(i18n.language).format(count.data)
                      })
                    : undefined
                }
                onPress={() => router.push('/live-inbox')}
                style={[styles.tile, { backgroundColor: colors.tones.pink.soft }]}
              >
                <View>
                  <IconBadge name='bell-ringing' tone='pink' />
                  {count.data ? (
                    <View style={styles.tileBadge}>
                      <Text style={styles.tileBadgeText}>{count.data > 99 ? '99+' : count.data}</Text>
                    </View>
                  ) : null}
                </View>
                <Text numberOfLines={2} style={styles.tileLabel}>
                  {t('navigation.inbox')}
                </Text>
                <Text numberOfLines={1} style={styles.tileMeta}>
                  {count.data !== undefined
                    ? t('home.live.unread', {
                        count: count.data,
                        formattedCount: new Intl.NumberFormat(i18n.language).format(count.data)
                      })
                    : count.isError
                      ? t('home.live.countError')
                      : t('home.live.countLoading')}
                </Text>
              </PressableFeedback>
              <PressableFeedback
                accessibilityRole='button'
                accessibilityLabel={t('navigation.tab.profile')}
                onPress={() => router.push('/profile')}
                style={[styles.tile, { backgroundColor: colors.tones.indigo.soft }]}
              >
                <IconBadge name='user-circle' tone='indigo' />
                <Text numberOfLines={2} style={styles.tileLabel}>
                  {t('navigation.tab.profile')}
                </Text>
              </PressableFeedback>
            </View>
          </>
        ) : profile.isError || (account && !role) ? (
          <View style={styles.notice}>
            <Text accessibilityRole='alert' style={styles.cardDescription}>
              {t('account.error')}
            </Text>
            <PressableFeedback accessibilityRole='button' onPress={() => void profile.refetch()}>
              <Text style={styles.link}>{t('account.retry')}</Text>
            </PressableFeedback>
          </View>
        ) : (
          <LoadingState label={t('account.loading')} />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, gap: 18, paddingBottom: 36 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    profile: { flex: 1 },
    eyebrow: { color: colors.primaryInk, fontWeight: '700', fontSize: 12, letterSpacing: 1 },
    title: { color: colors.foreground, fontWeight: '700', fontSize: 27 },
    subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
    sectionTitle: { color: colors.foreground, fontSize: 18, fontWeight: '700' },
    featured: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: colors.primarySoft,
      borderCurve: 'continuous',
      borderRadius: 18,
      padding: 16,
      minHeight: 84
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    tile: {
      alignItems: 'center',
      borderCurve: 'continuous',
      borderRadius: 22,
      flexBasis: '30%',
      flexGrow: 1,
      gap: 10,
      maxWidth: '32%',
      minHeight: 124,
      paddingHorizontal: 8,
      paddingVertical: 16
    },
    tileLabel: { color: colors.foreground, fontSize: 13, fontWeight: '700', lineHeight: 18, textAlign: 'center' },
    tileMeta: { color: colors.muted, fontSize: 11, textAlign: 'center' },
    tileBadge: {
      alignItems: 'center',
      backgroundColor: colors.danger,
      borderColor: colors.surface,
      borderRadius: 10,
      borderWidth: 2,
      height: 20,
      justifyContent: 'center',
      minWidth: 20,
      paddingHorizontal: 4,
      position: 'absolute',
      right: -8,
      top: -6
    },
    tileBadgeText: { color: colors.onDanger, fontSize: 10, fontWeight: '800' },
    cardCopy: { flex: 1, gap: 5 },
    cardTitle: { color: colors.foreground, fontSize: 15, fontWeight: '700' },
    cardDescription: { color: colors.muted, fontSize: 13, lineHeight: 19 },
    notice: {
      backgroundColor: colors.surfaceSubtle,
      borderCurve: 'continuous',
      borderRadius: 14,
      padding: 14,
      color: colors.foreground
    },
    link: { color: colors.primaryInk, fontWeight: '700', paddingTop: 10 }
  })

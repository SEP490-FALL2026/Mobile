import { Feather } from '@expo/vector-icons'
import { type Href, Redirect, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeOut, ReduceMotion } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { mayCreateRequest } from '@/shared/api/request-eligibility'
import { useSession } from '@/shared/api/session-context'
import { useAccountProfile } from '@/shared/api/use-account-profile'
import { useUnreadCount } from '@/shared/api/use-unread-count'
import { impactHaptic } from '@/shared/native/haptics'
import type { IconTone, MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { Avatar } from '@/shared/ui/avatar'
import { IconBadge } from '@/shared/ui/icon-badge'
import { LoadingState } from '@/shared/ui/loading-state'
import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import { RefreshStatus, useRefreshFeedback } from '@/shared/ui/refresh-status'
import type { SaasIconName } from '@/shared/ui/saas-icon'
import { SentryMascot } from '@/shared/ui/sentry-mascot'

const MASCOT_SIZE = 176
const CHEER_MS = 1700

interface QuickAction {
  id: string
  label: string
  hint?: string
  icon: SaasIconName
  tone: IconTone
  href: Href
  badge?: number
}

// Home is built around Sentry: a large mascot in the middle opens the quick actions when tapped, and the
// unread count and the role's main queue stay visible underneath.
export function LiveHomeScreen() {
  const { t, i18n } = useTranslation()
  const pull = useRefreshFeedback()
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  const router = useRouter()
  const session = useSession()
  const profile = useAccountProfile()
  const count = useUnreadCount()
  const [open, setOpen] = useState(false)
  const [opened, setOpened] = useState(0)
  const [cheering, setCheering] = useState(false)
  const cheerTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (cheerTimer.current) clearTimeout(cheerTimer.current)
    },
    []
  )

  if (session.state === 'anonymous') return <Redirect href='/' />
  const account = !profile.isError ? profile.data : undefined
  const role = account?.roles.length === 1 ? account.roles[0] : undefined
  const mayRequest = mayCreateRequest(account)
  const manager = role === 'MANAGER' && !!account?.managerScope
  const tipRole = role === 'MANAGER' ? 'manager' : role === 'SPENDING_APPROVER' ? 'spendingApprover' : 'employee'
  const unread = count.data
  const unreadText =
    unread !== undefined
      ? t('home.live.unread', { count: unread, formattedCount: new Intl.NumberFormat(i18n.language).format(unread) })
      : count.isError
        ? t('home.live.countError')
        : t('home.live.countLoading')

  const actions: QuickAction[] = [
    {
      id: 'software',
      label: t('home.live.software'),
      hint: t('home.live.softwareDescription'),
      icon: 'squares-four',
      tone: 'blue',
      href: '/my-software'
    }
  ]
  if (mayRequest) {
    actions.push({
      id: 'create',
      label: t('navigation.createRequest'),
      hint: t('home.live.createDescription'),
      icon: 'plus-circle',
      tone: 'orange',
      href: '/live-request-create'
    })
  }
  if (role !== 'SPENDING_APPROVER') {
    actions.push({
      id: 'requests',
      label: t('home.live.requests'),
      hint: t('home.live.requestsDescription'),
      icon: 'file-text',
      tone: 'teal',
      href: '/live-requests'
    })
  }
  actions.push(
    {
      id: 'inbox',
      label: t('navigation.inbox'),
      hint: unreadText,
      icon: 'bell-ringing',
      tone: 'pink',
      href: '/live-inbox',
      badge: unread
    },
    { id: 'profile', label: t('navigation.tab.profile'), icon: 'user-circle', tone: 'indigo', href: '/profile' }
  )

  function toggle() {
    impactHaptic()
    if (!open) setOpened((value) => value + 1)
    setOpen((value) => !value)
    setCheering(true)
    if (cheerTimer.current) clearTimeout(cheerTimer.current)
    cheerTimer.current = setTimeout(() => setCheering(false), CHEER_MS)
  }

  const bubble = open ? t(`mascot.tips.${tipRole}.${opened % 2 === 1 ? 'first' : 'second'}`) : t('home.live.tapHint')

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
                size={44}
                onImageError={() => void profile.refetch()}
              />
              <View style={styles.profile}>
                <Text accessibilityRole='header' maxFontSizeMultiplier={1.3} numberOfLines={1} style={styles.title}>
                  {t('home.live.greeting', { name: account.employee.fullName })}
                </Text>
                <Text numberOfLines={1} style={styles.subtitle}>
                  {account.employee.department?.name ?? t('licenses.live.noDepartment')}
                </Text>
              </View>
            </View>

            <View style={styles.hero}>
              <View style={styles.bubble}>
                <Animated.Text
                  accessibilityLiveRegion='polite'
                  entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
                  key={bubble}
                  style={styles.bubbleText}
                >
                  {bubble}
                </Animated.Text>
                <View style={styles.bubbleTail} />
              </View>
              <View style={styles.stage}>
                <View style={[styles.halo, styles.haloOuter]} />
                <View style={[styles.halo, styles.haloInner]} />
                <Pressable
                  accessibilityLabel={t(open ? 'home.live.quickClose' : 'home.live.quickOpen')}
                  accessibilityRole='button'
                  accessibilityState={{ expanded: open }}
                  hitSlop={12}
                  onPress={toggle}
                >
                  <SentryMascot mood={cheering ? 'cheer' : undefined} size={MASCOT_SIZE} />
                </Pressable>
              </View>
            </View>

            {open ? (
              <Animated.View exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)} style={styles.quick}>
                <Text accessibilityRole='header' style={styles.sectionTitle}>
                  {t('home.live.actions')}
                </Text>
                <View style={styles.grid}>
                  {actions.map((action, index) => (
                    <Animated.View
                      entering={FadeInDown.delay(index * 55)
                        .duration(260)
                        .reduceMotion(ReduceMotion.System)}
                      key={action.id}
                      style={styles.tileSlot}
                    >
                      <PressableFeedback
                        accessibilityHint={action.hint}
                        accessibilityLabel={action.label}
                        accessibilityRole='button'
                        onPress={() => router.push(action.href)}
                        style={[styles.tile, { backgroundColor: colors.tones[action.tone].soft }]}
                      >
                        <View>
                          <IconBadge name={action.icon} tone={action.tone} />
                          {action.badge ? (
                            <View style={styles.tileBadge}>
                              <Text style={styles.tileBadgeText}>{action.badge > 99 ? '99+' : action.badge}</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text numberOfLines={2} style={styles.tileLabel}>
                          {action.label}
                        </Text>
                      </PressableFeedback>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
            ) : null}

            <PressableFeedback
              accessibilityRole='button'
              accessibilityLabel={unreadText}
              onPress={() => router.push('/live-inbox')}
              style={styles.infoCard}
            >
              <IconBadge name={unread ? 'bell-ringing' : 'bell'} size={42} tone='pink' />
              <View style={styles.cardCopy}>
                <Text style={styles.cardTitle}>{unreadText}</Text>
                <Text style={styles.cardDescription}>{t('navigation.inbox')}</Text>
              </View>
              <Feather color={colors.muted} name='chevron-right' size={20} />
            </PressableFeedback>
            {manager ? (
              <PressableFeedback
                accessibilityRole='button'
                accessibilityLabel={t('manager.live.openQueue')}
                onPress={() => router.push('/live-need-approvals')}
                style={styles.infoCard}
              >
                <IconBadge name='check-circle' size={42} tone='green' />
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{t('manager.live.openQueue')}</Text>
                  <Text style={styles.cardDescription}>{t('home.live.approvalsDescription')}</Text>
                </View>
                <Feather color={colors.muted} name='chevron-right' size={20} />
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
                style={styles.infoCard}
              >
                <IconBadge name='credit-card' size={42} tone='green' />
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{t('spending.live.openQueue')}</Text>
                  <Text style={styles.cardDescription}>{t('home.live.spendingDescription')}</Text>
                </View>
                <Feather color={colors.muted} name='chevron-right' size={20} />
              </PressableFeedback>
            ) : null}
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
    safe: { flex: 1, backgroundColor: colors.background, experimental_backgroundImage: colors.backgroundGradient },
    content: { padding: 20, gap: 18, paddingBottom: 36 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    profile: { flex: 1 },
    title: { color: colors.foreground, fontWeight: '800', fontSize: 22 },
    subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20 },
    hero: { alignItems: 'center', gap: 6, paddingTop: 4 },
    bubble: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 18,
      borderWidth: 1,
      boxShadow: '0 6px 18px rgba(35, 39, 65, 0.10)',
      maxWidth: 300,
      paddingHorizontal: 16,
      paddingVertical: 10
    },
    bubbleText: { color: colors.foreground, fontSize: 14, fontWeight: '600', lineHeight: 20, textAlign: 'center' },
    bubbleTail: {
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      borderRightColor: colors.border,
      borderRightWidth: 1,
      bottom: -7,
      height: 14,
      position: 'absolute',
      transform: [{ rotate: '45deg' }],
      width: 14
    },
    stage: { alignItems: 'center', height: MASCOT_SIZE + 44, justifyContent: 'center', width: '100%' },
    halo: { borderRadius: 999, position: 'absolute' },
    haloOuter: {
      backgroundColor: colors.tones.indigo.soft,
      height: MASCOT_SIZE + 44,
      opacity: 0.75,
      width: MASCOT_SIZE + 44
    },
    haloInner: {
      backgroundColor: colors.surface,
      height: MASCOT_SIZE - 6,
      opacity: 0.55,
      width: MASCOT_SIZE - 6
    },
    quick: { gap: 12 },
    sectionTitle: { color: colors.foreground, fontSize: 18, fontWeight: '700' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    tileSlot: { flexBasis: '30%', flexGrow: 1, maxWidth: '32%' },
    tile: {
      alignItems: 'center',
      borderCurve: 'continuous',
      borderRadius: 22,
      gap: 10,
      minHeight: 118,
      paddingHorizontal: 8,
      paddingVertical: 16
    },
    tileLabel: { color: colors.foreground, fontSize: 13, fontWeight: '700', lineHeight: 18, textAlign: 'center' },
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
    infoCard: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 20,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 14,
      minHeight: 76,
      padding: 14
    },
    cardCopy: { flex: 1, gap: 4 },
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

import { Feather } from '@expo/vector-icons'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LiveInboxScreen } from '@/features/inbox'
import type { NeedQueueResponseDtoDataItemsItem } from '@/shared/api/generated/model/need-decisions'
import type { ApprovalListResponseDtoDataItemsItem } from '@/shared/api/generated/model/spend-approvals'
import { useSession } from '@/shared/api/session-context'
import { useAccountProfile } from '@/shared/api/use-account-profile'
import { clampPage } from '@/shared/lib/clamp-page'
import { mobileColors } from '@/shared/theme/colors'

import { ApprovalQueueCard } from '../components/approval-queue-card'
import { QueueSection } from '../components/queue-section'
import { SpendingTabs, type SpendingTab } from '../components/spending-tabs'
import { StatusChip } from '../components/status-chip'
import { useManagerRequestApprovals } from '../hooks/use-manager-request-approvals'
import { useSpendQueue } from '../hooks/use-spend-approvals'
import { formatDate, formatMoney, initialsOf, outcomeTone } from '../model/spending-approvals'
import { ManagerRequestDetail } from './manager-request-detail-screen'
import { SpendApprovalDetail } from './spend-approval-detail-screen'

type Selection =
  | { kind: 'spend'; item: ApprovalListResponseDtoDataItemsItem }
  | { kind: 'manager'; item: NeedQueueResponseDtoDataItemsItem }

export function SpendingApprovalsScreen() {
  const { i18n, t } = useTranslation()
  const session = useSession()
  const profile = useAccountProfile()
  const [tab, setTab] = useState<SpendingTab>('spend')
  const [spendPage, setSpendPage] = useState(1)
  const [managerPage, setManagerPage] = useState(1)
  const [selection, setSelection] = useState<Selection>()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState(false)
  const isApprover = !!profile.data?.roles.includes('SPENDING_APPROVER') && !profile.isError
  const spend = useSpendQueue(spendPage, isApprover)
  const manager = useManagerRequestApprovals(managerPage, undefined, isApprover).queue
  const spendPages = spend.data?.pagination.totalPages
  const managerPages = manager.data?.pagination.totalPages
  useEffect(() => {
    const next = clampPage(spendPage, spendPages)
    if (next !== spendPage) setSpendPage(next)
  }, [spendPage, spendPages])
  useEffect(() => {
    const next = clampPage(managerPage, managerPages)
    if (next !== managerPage) setManagerPage(next)
  }, [managerPage, managerPages])

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
  function selectTab(next: SpendingTab) {
    setSelection(undefined)
    setTab(next)
  }

  if (session.state === 'anonymous') return <Redirect href='/' />
  if (profile.data && !profile.isError && !isApprover) {
    return <Redirect href={profile.data.roles.includes('MANAGER') ? '/live-need-approvals' : '/my-software'} />
  }

  const tabs = <SpendingTabs active={tab} disabled={false} onSelect={selectTab} />
  if (isApprover && tab === 'inbox') return <LiveInboxScreen navigation={tabs} />

  const format = new Intl.NumberFormat(i18n.language)
  const spendTotal = spend.data?.pagination.totalItems
  const managerTotal = manager.data?.pagination.totalItems

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps='handled'>
          {!selection && profile.data && isApprover ? (
            <View style={styles.profile}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initialsOf(profile.data.employee.fullName)}</Text>
              </View>
              <View style={styles.profileCopy}>
                <Text numberOfLines={1} style={styles.name}>
                  {profile.data.employee.fullName}
                </Text>
                <StatusChip label={t('spending.role')} />
              </View>
              <Pressable
                accessibilityLabel={t('navigation.openTab', { tab: t('navigation.inbox') })}
                accessibilityRole='button'
                onPress={() => selectTab('inbox')}
                style={styles.iconButton}
              >
                <Feather
                  accessibilityElementsHidden
                  color={mobileColors.primaryInk}
                  importantForAccessibility='no'
                  name='bell'
                  size={18}
                />
              </Pressable>
              <Pressable
                accessibilityLabel={t('licenses.live.logout')}
                accessibilityRole='button'
                accessibilityState={{ busy: loggingOut, disabled: loggingOut }}
                disabled={loggingOut}
                onPress={() => void logout()}
                style={styles.iconButton}
              >
                <Feather
                  accessibilityElementsHidden
                  color={mobileColors.primaryInk}
                  importantForAccessibility='no'
                  name='log-out'
                  size={18}
                />
              </Pressable>
            </View>
          ) : null}
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
            <View style={styles.errorBox}>
              <Text accessibilityRole='alert' style={styles.error}>
                {t('spending.profileError')}
              </Text>
              <Pressable accessibilityRole='button' onPress={() => void profile.refetch()} style={styles.action}>
                <Text style={styles.actionText}>{t('spending.retry')}</Text>
              </Pressable>
              <Pressable accessibilityRole='button' onPress={() => void logout()} style={styles.action}>
                <Text style={styles.actionText}>{t('licenses.live.logout')}</Text>
              </Pressable>
            </View>
          ) : null}

          {isApprover && selection?.kind === 'spend' ? (
            <SpendApprovalDetail item={selection.item} onBack={() => setSelection(undefined)} />
          ) : null}
          {isApprover && selection?.kind === 'manager' ? (
            <ManagerRequestDetail item={selection.item} onBack={() => setSelection(undefined)} />
          ) : null}

          {isApprover && !selection ? (
            <>
              <View style={styles.heading}>
                <Text style={styles.kicker}>{t('spending.kicker')}</Text>
                <Text accessibilityRole='header' style={styles.title}>
                  {t('spending.title')}
                </Text>
                <Text style={styles.muted}>{t('spending.subtitle')}</Text>
              </View>

              <View style={styles.summary}>
                <SummaryCard
                  active={tab === 'spend'}
                  icon='credit-card'
                  label={t('spending.tabs.spend')}
                  onPress={() => selectTab('spend')}
                  value={spendTotal === undefined ? '–' : format.format(spendTotal)}
                />
                <SummaryCard
                  active={tab === 'manager'}
                  icon='users'
                  label={t('spending.tabs.manager')}
                  onPress={() => selectTab('manager')}
                  value={managerTotal === undefined ? '–' : format.format(managerTotal)}
                />
              </View>
            </>
          ) : null}

          {isApprover && !selection && tab === 'spend' ? (
            <QueueSection
              emptyHint={t('spending.spendQueue.emptyHint')}
              emptyTitle={t('spending.spendQueue.empty')}
              errorText={t('spending.spendQueue.error')}
              hasItems={!!spend.data?.items.length}
              hint={t('spending.spendQueue.hint')}
              isError={spend.isError}
              isLoading={spend.isLoading}
              onPage={setSpendPage}
              onRefresh={() => void spend.refetch()}
              page={spendPage}
              title={t('spending.spendQueue.title')}
              totalItems={spendTotal}
              totalPages={spend.data?.pagination.totalPages}
            >
              {spend.data?.items.map((item) => {
                const name = item.plan?.applicationName ?? item.softwareName ?? t('spending.unnamed')
                return (
                  <ApprovalQueueCard
                    accessibilityLabel={t('spending.card.open', { name, person: item.requester.fullName })}
                    amount={formatMoney(item.amount, i18n.language)}
                    chips={
                      <>
                        {item.outcome ? (
                          <StatusChip label={t(`spending.outcome.${item.outcome}`)} tone={outcomeTone(item.outcome)} />
                        ) : null}
                        {item.routing.mode === 'ONE_STEP' ? <StatusChip label={t('spending.routing.oneStep')} /> : null}
                      </>
                    }
                    due={t('spending.card.due', {
                      date: formatDate(item.dueOn, i18n.language) ?? t('spending.dateUnavailable')
                    })}
                    key={item.stepId}
                    onPress={() => setSelection({ kind: 'spend', item })}
                    person={item.requester.fullName}
                    personMeta={item.costCenter.code}
                    plan={item.plan ? t('spending.plan', { plan: item.plan.planName }) : undefined}
                    title={name}
                  />
                )
              })}
            </QueueSection>
          ) : null}

          {isApprover && !selection && tab === 'manager' ? (
            <QueueSection
              emptyHint={t('spending.managerQueue.emptyHint')}
              emptyTitle={t('spending.managerQueue.empty')}
              errorText={t('spending.managerQueue.error')}
              hasItems={!!manager.data?.items.length}
              hint={t('spending.managerQueue.hint')}
              isError={manager.isError}
              isLoading={manager.isLoading}
              onPage={setManagerPage}
              onRefresh={() => void manager.refetch()}
              page={managerPage}
              title={t('spending.managerQueue.title')}
              totalItems={managerTotal}
              totalPages={manager.data?.pagination.totalPages}
            >
              {manager.data?.items.map((item) => {
                const name = item.plan?.applicationName ?? item.softwareName ?? t('spending.unnamed')
                return (
                  <ApprovalQueueCard
                    accessibilityLabel={t('spending.card.open', { name, person: item.requester.fullName })}
                    amount={
                      item.pricing.status === 'PRICED' ? formatMoney(item.pricing.amount, i18n.language) : undefined
                    }
                    chips={
                      <>
                        <StatusChip label={t('spending.manager.oneStep')} />
                        {item.termMonths !== null ? (
                          <StatusChip label={t('spending.months', { count: item.termMonths })} />
                        ) : null}
                      </>
                    }
                    due={t('spending.card.due', {
                      date: formatDate(item.dueOn, i18n.language) ?? t('spending.dateUnavailable')
                    })}
                    key={item.stepId}
                    onPress={() => setSelection({ kind: 'manager', item })}
                    person={item.requester.fullName}
                    personMeta={item.department.name}
                    plan={item.plan ? t('spending.plan', { plan: item.plan.planName }) : undefined}
                    title={name}
                  />
                )
              })}
            </QueueSection>
          ) : null}
        </ScrollView>
        {isApprover ? tabs : null}
      </View>
    </SafeAreaView>
  )
}

function SummaryCard({
  active,
  icon,
  label,
  onPress,
  value
}: {
  active: boolean
  icon: keyof typeof Feather.glyphMap
  label: string
  onPress: () => void
  value: string
}) {
  return (
    <Pressable
      accessibilityLabel={`${label}: ${value}`}
      accessibilityRole='button'
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.summaryCard, active && styles.summaryCardActive]}
    >
      <View style={[styles.summaryIcon, active && styles.summaryIconActive]}>
        <Feather
          accessibilityElementsHidden
          color={active ? mobileColors.white : mobileColors.primaryInk}
          importantForAccessibility='no'
          name={icon}
          size={16}
        />
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  action: {
    minHeight: 44,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: mobileColors.primarySoft
  },
  actionText: { color: mobileColors.primaryInk, fontWeight: '700' },
  avatar: {
    alignItems: 'center',
    backgroundColor: mobileColors.primarySoft,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  avatarText: { color: mobileColors.primaryInk, fontSize: 16, fontWeight: '700' },
  content: { gap: 16, padding: 16, paddingBottom: 28 },
  error: { color: mobileColors.danger, fontSize: 13, lineHeight: 19 },
  errorBox: { gap: 4 },
  heading: { gap: 4 },
  iconButton: {
    alignItems: 'center',
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  kicker: {
    color: mobileColors.primaryInk,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  muted: { color: mobileColors.muted, fontSize: 13, lineHeight: 19 },
  name: { color: mobileColors.foreground, fontSize: 15, fontWeight: '700' },
  profile: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  profileCopy: { flex: 1, gap: 4 },
  safe: { backgroundColor: mobileColors.background, flex: 1 },
  screen: { flex: 1 },
  summary: { flexDirection: 'row', gap: 10 },
  summaryCard: {
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 18,
    borderWidth: 1,
    boxShadow: '0px 3px 8px rgba(93, 59, 32, 0.04)',
    flex: 1,
    gap: 4,
    padding: 14
  },
  summaryCardActive: { borderColor: mobileColors.primary },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: mobileColors.primarySoft,
    borderRadius: 12,
    height: 32,
    justifyContent: 'center',
    marginBottom: 2,
    width: 36
  },
  summaryIconActive: { backgroundColor: mobileColors.primary },
  summaryLabel: { color: mobileColors.muted, fontSize: 12, lineHeight: 16 },
  summaryValue: { color: mobileColors.foreground, fontSize: 24, fontWeight: '700' },
  title: { color: mobileColors.foreground, fontSize: 25, fontWeight: '700', letterSpacing: -0.5 }
})

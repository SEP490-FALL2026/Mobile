import { Feather } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import { clampPage } from '@/shared/lib/clamp-page'
import { mobileColors } from '@/shared/theme/colors'
import { Pager } from '@/shared/ui/pager'
import { StatusBadge } from '@/shared/ui/status-badge'

import { useSpendQueue } from '../hooks/use-spend-queue'
import { formatMoney } from '../model/format'

const maxBatch = 50
const maxReasonLength = 500

type Outcome = 'WITHIN_BASE' | 'USES_RESERVE' | 'BLOCKED'
const outcomeTone = { WITHIN_BASE: 'success', USES_RESERVE: 'warning', BLOCKED: 'danger' } as const

export function SpendQueuePanel({ permitted }: { permitted: boolean }) {
  const { i18n, t } = useTranslation()
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [reasons, setReasons] = useState<Record<string, string>>({})
  const [confirming, setConfirming] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const { queue, submit } = useSpendQueue(page, permitted)
  const items = queue.data?.items ?? []
  const totalPages = queue.data?.pagination.totalPages
  const format = new Intl.NumberFormat(i18n.language)
  const selectable = (item: (typeof items)[number]) =>
    item.stage !== 'BLOCKED' && (item.readyToSubmit || item.budgetOutcome === 'USES_RESERVE')
  const ready = items.filter(selectable)
  const locked = submit.isPending || submit.isError
  const needsReason = items.filter((item) => selected.includes(item.requestId) && item.budgetOutcome === 'USES_RESERVE')

  useEffect(() => {
    const next = clampPage(page, totalPages)
    if (next !== page) setPage(next)
  }, [page, totalPages])

  function toggle(requestId: string) {
    if (locked) return
    setConfirming(false)
    setSelected((current) =>
      current.includes(requestId)
        ? current.filter((id) => id !== requestId)
        : current.length < maxBatch
          ? [...current, requestId]
          : current
    )
  }
  function validReason(requestId: string) {
    const text = (reasons[requestId] ?? '').trim()
    return text.length >= 1 && text.length <= maxReasonLength && !/[\r\n]/.test(text)
  }
  function send() {
    if (locked || selected.length === 0) return
    if (!needsReason.every((item) => validReason(item.requestId))) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    submit.mutate(
      {
        requestIds: selected,
        ...(needsReason.length
          ? {
              reserveConfirmations: needsReason.map((item) => ({
                requestId: item.requestId,
                reason: (reasons[item.requestId] ?? '').trim()
              }))
            }
          : {})
      },
      {
        onSuccess: () => {
          setSelected([])
          setReasons({})
          setConfirming(false)
        }
      }
    )
  }

  if (submit.isSuccess) {
    const { batch, results } = submit.data
    return (
      <View style={styles.stack}>
        <View accessibilityRole='summary' style={[styles.banner, styles.bannerOk]}>
          <Feather
            accessibilityElementsHidden
            color={mobileColors.success}
            importantForAccessibility='no'
            name='send'
            size={18}
          />
          <Text style={styles.bannerOkText}>{t('manager.spend.sent', { count: batch.itemCount })}</Text>
        </View>
        {results.map((item) => (
          <View key={item.requestId} style={styles.card}>
            <Text style={styles.muted}>{t('manager.spend.reference', { id: item.requestId })}</Text>
            <Text
              style={
                item.outcome === 'STOPPED'
                  ? styles.error
                  : item.outcome === 'SENT_TO_APPROVER'
                    ? styles.ok
                    : styles.warning
              }
            >
              {t(`manager.spend.outcomes.${item.outcome}`)}
            </Text>
            {item.stopReason ? (
              <Text style={styles.muted}>{t(`manager.spend.stopReasons.${item.stopReason}`)}</Text>
            ) : null}
            {item.reserveConfirmation === 'IGNORED' ? (
              <Text style={styles.muted}>{t('manager.spend.reserveIgnored')}</Text>
            ) : null}
          </View>
        ))}
        <Pressable accessibilityRole='button' onPress={() => submit.reset()} style={styles.secondary}>
          <Text style={styles.secondaryText}>{t('manager.spend.backToQueue')}</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.stack}>
      <View style={styles.heading}>
        <View style={styles.copy}>
          <Text accessibilityRole='header' style={styles.title}>
            {t('manager.spend.title')}
          </Text>
          <Text style={styles.muted}>{t('manager.spend.hint')}</Text>
        </View>
        {queue.data ? (
          <View style={styles.count}>
            <Text style={styles.countText}>{format.format(queue.data.pagination.totalItems)}</Text>
          </View>
        ) : null}
      </View>

      {queue.isLoading ? (
        <Text accessibilityRole='progressbar' style={styles.muted}>
          {t('manager.live.loading')}
        </Text>
      ) : null}
      {queue.isError ? (
        <View>
          <Text accessibilityRole='alert' style={styles.error}>
            {t('manager.spend.error')}
          </Text>
          <Pressable accessibilityRole='button' onPress={() => void queue.refetch()} style={styles.action}>
            <Text style={styles.link}>{t('licenses.live.retry')}</Text>
          </Pressable>
        </View>
      ) : null}
      {submit.isError ? (
        <Text accessibilityRole='alert' style={styles.error}>
          {t('manager.spend.uncertain')}
        </Text>
      ) : null}
      {queue.data && items.length === 0 ? (
        <View style={styles.empty}>
          <Feather
            accessibilityElementsHidden
            color={mobileColors.success}
            importantForAccessibility='no'
            name='check-circle'
            size={26}
          />
          <Text style={styles.emptyTitle}>{t('manager.spend.empty')}</Text>
          <Text style={styles.muted}>{t('manager.spend.emptyHint')}</Text>
        </View>
      ) : null}

      {ready.length > 0 ? (
        <Pressable
          accessibilityRole='button'
          disabled={locked}
          onPress={() => {
            setConfirming(false)
            setSelected(ready.slice(0, maxBatch).map((item) => item.requestId))
          }}
          style={styles.action}
        >
          <Text style={styles.link}>{t('manager.spend.selectReady', { count: Math.min(ready.length, maxBatch) })}</Text>
        </Pressable>
      ) : null}

      {items.map((item) => {
        const name = item.plan?.applicationName ?? item.softwareName ?? t('requests.live.unnamed')
        const checked = selected.includes(item.requestId)
        const canSelect = selectable(item)
        const outcome = item.budgetOutcome as Outcome | null
        return (
          <View
            key={item.requestId}
            style={[styles.card, checked && styles.cardChecked, !canSelect && styles.cardBlocked]}
          >
            <Pressable
              accessibilityLabel={t('manager.spend.select', { name, person: item.requester.fullName })}
              accessibilityRole='checkbox'
              accessibilityState={{ checked, disabled: locked || !canSelect }}
              disabled={locked || !canSelect}
              onPress={() => toggle(item.requestId)}
              style={styles.cardBody}
            >
              <View style={styles.row}>
                <View style={[styles.box, checked && styles.boxChecked]}>
                  {checked ? (
                    <Feather color={mobileColors.white} importantForAccessibility='no' name='check' size={14} />
                  ) : null}
                </View>
                <View style={styles.copy}>
                  <Text style={styles.name}>{name}</Text>
                  <Text style={styles.muted}>
                    {item.plan ? `${t('licenses.live.plan', { plan: item.plan.planName })} · ` : ''}
                    {item.requester.fullName}
                  </Text>
                </View>
                <Text style={styles.amount}>{formatMoney(item.amount, i18n.language) ?? ''}</Text>
              </View>
              {item.lineCount > 1 ? (
                <Text style={styles.muted}>
                  {t('requests.live.lineCount', {
                    count: item.lineCount,
                    formattedCount: format.format(item.lineCount)
                  })}
                </Text>
              ) : null}
              <View style={styles.badges}>
                {outcome ? (
                  <StatusBadge label={t(`manager.spend.budgetOutcomes.${outcome}`)} tone={outcomeTone[outcome]} />
                ) : null}
                {item.stage === 'RESERVE_CONFIRMATION' ? (
                  <StatusBadge label={t('manager.spend.stages.RESERVE_CONFIRMATION')} tone='warning' />
                ) : null}
              </View>
              {item.blockedReasons.map((reason) => (
                <Text key={reason} style={styles.error}>
                  {t(`manager.spend.stopReasons.${reason}`)}
                </Text>
              ))}
              {item.overBy ? (
                <Text style={styles.warning}>
                  {t('manager.spend.overBy', { amount: formatMoney(item.overBy, i18n.language) ?? '' })}
                </Text>
              ) : null}
              <Text style={item.overdue ? styles.error : styles.muted}>
                {t('manager.spend.waited', { days: format.format(item.waitedWorkingDays) })}
              </Text>
            </Pressable>
            {checked && item.budgetOutcome === 'USES_RESERVE' ? (
              <View style={styles.reserve}>
                <Text style={styles.label}>{t('manager.spend.reserveReason')}</Text>
                <TextInput
                  accessibilityLabel={t('manager.spend.reserveReasonFor', { name })}
                  editable={!locked}
                  maxLength={maxReasonLength}
                  onChangeText={(text) => {
                    setReasons((current) => ({ ...current, [item.requestId]: text.replace(/[\r\n]+/g, ' ') }))
                    setInvalid(false)
                  }}
                  placeholder={t('manager.spend.reservePlaceholder')}
                  placeholderTextColor={mobileColors.muted}
                  style={styles.input}
                  value={reasons[item.requestId] ?? ''}
                />
              </View>
            ) : null}
          </View>
        )
      })}

      {queue.data && queue.data.pagination.totalPages > 1 ? (
        <Pager onPage={setPage} page={page} totalPages={queue.data.pagination.totalPages} />
      ) : null}

      {invalid ? (
        <Text accessibilityRole='alert' style={styles.error}>
          {t('manager.spend.reserveRequired')}
        </Text>
      ) : null}
      {selected.length > 0 && !confirming ? (
        <Pressable accessibilityRole='button' onPress={() => setConfirming(true)} style={styles.primary}>
          <Text style={styles.primaryText}>{t('manager.spend.submit', { count: selected.length })}</Text>
        </Pressable>
      ) : null}
      {confirming ? (
        <View style={styles.card}>
          <Text style={styles.name}>{t('manager.spend.confirmTitle', { count: selected.length })}</Text>
          <Text style={styles.muted}>{t('manager.spend.confirmNote')}</Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole='button'
              disabled={locked}
              onPress={() => setConfirming(false)}
              style={[styles.secondary, locked && styles.disabled]}
            >
              <Text style={styles.secondaryText}>{t('requests.cancel')}</Text>
            </Pressable>
            <Pressable
              accessibilityRole='button'
              accessibilityState={{ busy: submit.isPending, disabled: locked }}
              disabled={locked}
              onPress={send}
              style={[styles.primaryInline, locked && styles.disabled]}
            >
              <Text style={styles.primaryText}>
                {submit.isPending ? t('manager.spend.sending') : t('manager.spend.confirmSend')}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  action: {
    alignSelf: 'flex-start',
    backgroundColor: mobileColors.primarySoft,
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 14
  },
  actions: { flexDirection: 'row', gap: 10 },
  amount: { color: mobileColors.foreground, fontSize: 14, fontWeight: '700' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  banner: { alignItems: 'center', borderRadius: 12, flexDirection: 'row', gap: 9, padding: 12 },
  bannerOk: { backgroundColor: mobileColors.successSoft },
  bannerOkText: { color: mobileColors.success, flex: 1, fontSize: 13, fontWeight: '600' },
  box: {
    alignItems: 'center',
    borderColor: mobileColors.border,
    borderRadius: 7,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24
  },
  boxChecked: { backgroundColor: mobileColors.primary, borderColor: mobileColors.primary },
  card: {
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 18,
    borderWidth: 1,
    boxShadow: '0px 4px 10px rgba(93, 59, 32, 0.04)',
    gap: 8,
    padding: 14
  },
  cardBlocked: { opacity: 0.7 },
  cardBody: { gap: 7 },
  cardChecked: { borderColor: mobileColors.primary },
  copy: { flex: 1, gap: 2 },
  count: {
    alignItems: 'center',
    backgroundColor: mobileColors.primarySoft,
    borderRadius: 12,
    justifyContent: 'center',
    minWidth: 34,
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  countText: { color: mobileColors.primaryInk, fontSize: 13, fontWeight: '700' },
  disabled: { opacity: 0.4 },
  empty: {
    alignItems: 'center',
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 24
  },
  emptyTitle: { color: mobileColors.foreground, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  error: { color: mobileColors.danger, fontSize: 13, lineHeight: 19 },
  heading: { alignItems: 'flex-start', flexDirection: 'row', gap: 10 },
  input: {
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: mobileColors.foreground,
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: 12
  },
  label: { color: mobileColors.muted, fontSize: 12, fontWeight: '600' },
  link: { color: mobileColors.primaryInk, fontWeight: '700' },
  muted: { color: mobileColors.muted, fontSize: 12, lineHeight: 18 },
  name: { color: mobileColors.foreground, fontSize: 15, fontWeight: '700' },
  ok: { color: mobileColors.success, fontSize: 13, fontWeight: '700' },
  primary: {
    alignItems: 'center',
    backgroundColor: mobileColors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 50
  },
  primaryInline: {
    alignItems: 'center',
    backgroundColor: mobileColors.primary,
    borderRadius: 14,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48
  },
  primaryText: { color: mobileColors.white, fontSize: 14, fontWeight: '700' },
  reserve: { borderTopColor: mobileColors.border, borderTopWidth: 1, gap: 6, paddingTop: 10 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  secondary: {
    alignItems: 'center',
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48
  },
  secondaryText: { color: mobileColors.foreground, fontSize: 14, fontWeight: '700' },
  stack: { gap: 12 },
  title: { color: mobileColors.foreground, fontSize: 17, fontWeight: '700' },
  warning: { color: mobileColors.warning, fontSize: 12, lineHeight: 18 }
})

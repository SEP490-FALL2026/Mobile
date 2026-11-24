import { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { SentryMascot } from './sentry-mascot'

export type RefreshState = 'idle' | 'loading' | 'done' | 'failed'

const MIN_LOADING_MS = 700
const RESULT_VISIBLE_MS = 2600

interface RefetchResult {
  isError: boolean
}

// Tracks a user-requested refresh: loading while it runs (at least briefly, so it is noticed), then a short-lived
// result. Background refetches do not trigger it.
export function useRefreshFeedback() {
  const [state, setState] = useState<RefreshState>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const running = useRef(false)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  const refresh = useCallback(async (refetch: () => Promise<RefetchResult>) => {
    if (running.current) return
    running.current = true
    if (timer.current) clearTimeout(timer.current)
    setState('loading')
    let failed = false
    try {
      const [result] = await Promise.all([refetch(), new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS))])
      failed = result.isError
    } catch {
      failed = true
    }
    running.current = false
    setState(failed ? 'failed' : 'done')
    timer.current = setTimeout(() => setState('idle'), RESULT_VISIBLE_MS)
  }, [])

  return { state, refresh }
}

interface RefreshStatusProps {
  state: RefreshState
  loadingLabel: string
  doneLabel: string
  failedLabel: string
}

export function RefreshStatus({ state, loadingLabel, doneLabel, failedLabel }: RefreshStatusProps) {
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  if (state === 'idle') return null
  const failed = state === 'failed'
  return (
    <View
      accessibilityLiveRegion='polite'
      accessibilityRole={state === 'loading' ? 'progressbar' : 'alert'}
      style={[styles.row, failed && styles.rowFailed]}
    >
      <SentryMascot mood={state === 'loading' ? 'hop' : state === 'done' ? 'cheer' : 'idle'} size={44} />
      <Text style={[styles.text, failed && styles.textFailed]}>
        {state === 'loading' ? loadingLabel : state === 'done' ? doneLabel : failedLabel}
      </Text>
    </View>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    row: {
      alignItems: 'center',
      backgroundColor: colors.primarySoft,
      borderCurve: 'continuous',
      borderRadius: 14,
      flexDirection: 'row',
      gap: 10,
      paddingHorizontal: 12,
      paddingVertical: 6
    },
    rowFailed: { backgroundColor: colors.dangerBackground },
    text: { color: colors.primaryInk, flex: 1, fontSize: 14, fontWeight: '700' },
    textFailed: { color: colors.danger }
  })

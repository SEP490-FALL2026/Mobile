import { usePreventRemove } from '@react-navigation/native'
import { useFocusEffect } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { BackHandler, Platform } from 'react-native'

import { useLiveWithdraw } from './use-live-withdraw'

// Withdrawal of one request from its detail screen: ask first, send once, and keep the user on the screen
// (no navigation, no Android Back) while the write is in flight.
export function useRequestWithdraw(requestId: string) {
  const withdrawal = useLiveWithdraw()
  const [confirming, setConfirming] = useState(false)
  const sent = useRef(false)
  const inFlight = withdrawal.isPending || sent.current

  usePreventRemove(inFlight, () => undefined)
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => inFlight || sent.current)
      return () => subscription.remove()
    }, [inFlight])
  )

  function confirm() {
    if (sent.current) return
    sent.current = true
    withdrawal.mutate(requestId, {
      onSettled: () => {
        sent.current = false
        setConfirming(false)
      }
    })
  }

  return {
    withdrawal,
    confirming,
    inFlight,
    open: () => setConfirming(true),
    close: () => {
      if (!sent.current) setConfirming(false)
    },
    confirm
  }
}

export type RequestWithdrawFlow = ReturnType<typeof useRequestWithdraw>

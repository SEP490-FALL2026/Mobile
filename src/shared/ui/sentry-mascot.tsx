import { Image } from 'expo-image'
import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'

import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

// Reviewed re-encode of the web sprite: 10 columns x 3 rows of 192px frames (idle, hop, cheer).

const SPRITE = require('../../../assets/mascot/sentry-mascot-sprite.webp')

type MascotMood = 'idle' | 'hop' | 'cheer'

interface SentryMascotProps {
  size?: number
  // Plays one reel regardless of interaction, e.g. `hop` while something loads.
  mood?: MascotMood
  // Interactive mode is one button: a tap plays the cheer reel and shows the next message in a bubble.
  interactive?: { label: string; messages: readonly string[] }
}

const BUBBLE_VISIBLE_MS = 4200
const FRAMES = 10

export function SentryMascot({ size = 56, mood, interactive }: SentryMascotProps) {
  const { colors } = useMobileTheme()
  const styles = createStyles(colors, size)
  const reducedMotion = useReducedMotion()
  const [tapMood, setTapMood] = useState<MascotMood>('idle')
  const [messageIndex, setMessageIndex] = useState<number | null>(null)
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const active = mood ?? tapMood
  const progress = useSharedValue(0)
  const bob = useSharedValue(0)

  useEffect(
    () => () => {
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    },
    []
  )

  useEffect(() => {
    cancelAnimation(progress)
    cancelAnimation(bob)
    progress.value = 0
    bob.value = 0
    if (reducedMotion) return
    const linear = Easing.linear
    if (active === 'idle') {
      progress.value = withRepeat(withTiming(1, { duration: 4600, easing: linear }), -1, false)
      bob.value = withRepeat(
        withSequence(withTiming(-3, { duration: 1600 }), withTiming(0, { duration: 1600 })),
        -1,
        false
      )
    } else if (active === 'hop') {
      progress.value = withRepeat(withTiming(1, { duration: 900, easing: linear }), -1, false)
    } else {
      progress.value = withRepeat(withTiming(1, { duration: 850, easing: linear }), 2, false, (finished) => {
        if (finished) runOnJS(setTapMood)('idle')
      })
    }
  }, [active, bob, progress, reducedMotion])

  const bodyStyle = useAnimatedStyle(() => {
    const p = progress.value
    let frame = 0
    let row = 0
    if (active === 'idle') {
      // Eyes open most of the cycle, then a quick half -> closed -> half blink.
      frame = p < 0.88 ? 0 : p < 0.9 ? 5 : p < 0.93 ? 6 : p < 0.95 ? 7 : 0
    } else {
      row = active === 'hop' ? 1 : 2
      frame = Math.min(FRAMES - 1, Math.floor(p * FRAMES))
    }
    return { transform: [{ translateX: -frame * size }, { translateY: -row * size }] }
  }, [active, size])
  const bobStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value }] }))

  const figure = (
    <View style={styles.figure}>
      <View style={styles.stage} />
      <View style={styles.shadow} />
      <Animated.View style={bobStyle}>
        <View style={styles.window}>
          <Animated.View style={[styles.sheet, bodyStyle]}>
            <Image contentFit='fill' source={SPRITE} style={styles.sheet} />
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  )

  if (!interactive) {
    return (
      <View accessibilityElementsHidden importantForAccessibility='no-hide-descendants'>
        {figure}
      </View>
    )
  }

  const { messages } = interactive
  function cheer() {
    setTapMood('cheer')
    setMessageIndex((current) => (messages.length ? ((current ?? -1) + 1) % messages.length : null))
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    bubbleTimer.current = setTimeout(() => setMessageIndex(null), BUBBLE_VISIBLE_MS)
  }

  return (
    <View style={styles.interactive}>
      <Pressable accessibilityLabel={interactive.label} accessibilityRole='button' hitSlop={8} onPress={cheer}>
        {figure}
      </Pressable>
      {messageIndex !== null ? (
        <View accessibilityLiveRegion='polite' style={styles.bubble}>
          <Text style={styles.bubbleText}>{messages[messageIndex]}</Text>
        </View>
      ) : null}
    </View>
  )
}

const createStyles = (colors: MobileColors, size: number) =>
  StyleSheet.create({
    interactive: { zIndex: 2 },
    figure: { height: size, width: size },
    stage: {
      backgroundColor: colors.primarySoft,
      borderRadius: size,
      bottom: size * 0.02,
      left: size * 0.04,
      opacity: 0.8,
      position: 'absolute',
      right: size * 0.04,
      top: size * 0.08
    },
    shadow: {
      alignSelf: 'center',
      backgroundColor: colors.foreground,
      borderRadius: size,
      bottom: 1,
      height: size * 0.09,
      opacity: 0.14,
      position: 'absolute',
      width: size * 0.52
    },
    window: { height: size, overflow: 'hidden', width: size },
    sheet: { height: size * 3, width: size * FRAMES },
    bubble: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 14,
      borderWidth: 1,
      boxShadow: '0 4px 14px rgba(35, 39, 65, 0.12)',
      padding: 12,
      position: 'absolute',
      right: 0,
      top: size + 6,
      width: 220
    },
    bubbleText: { color: colors.foreground, fontSize: 13, lineHeight: 19 }
  })

import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { selectionHaptic } from '@/shared/native/haptics'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { PressableFeedback } from './pressable-feedback'

const PADDING = 4
const GAP = 4

interface SegmentedControlProps<T extends string> {
  accessibilityLabel?: string
  disabled?: boolean
  onChange: (value: T) => void
  options: readonly { label: string; value: T }[]
  value: T
}

// Two or three mutually exclusive views of the same list, shown as one track with a raised active segment
// that slides to the chosen option.
export function SegmentedControl<T extends string>({
  accessibilityLabel,
  disabled,
  onChange,
  options,
  value
}: SegmentedControlProps<T>) {
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  const [trackWidth, setTrackWidth] = useState(0)
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  )
  const segmentWidth = options.length ? (trackWidth - 2 - PADDING * 2 - GAP * (options.length - 1)) / options.length : 0
  const offset = useSharedValue(0)
  const placed = useSharedValue(false)

  useEffect(() => {
    if (segmentWidth <= 0) return
    const target = index * (segmentWidth + GAP)
    if (!placed.value) {
      offset.value = target
      placed.value = true
      return
    }
    offset.value = withTiming(target, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System
    })
  }, [index, offset, placed, segmentWidth])

  const indicatorStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }))

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      style={styles.track}
    >
      {segmentWidth > 0 ? (
        <Animated.View pointerEvents='none' style={[styles.indicator, { width: segmentWidth }, indicatorStyle]} />
      ) : null}
      {options.map((option) => {
        const selected = option.value === value
        return (
          <PressableFeedback
            key={option.value}
            accessibilityRole='button'
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => {
              if (selected) return
              selectionHaptic()
              onChange(option.value)
            }}
            style={[styles.segment, segmentWidth <= 0 && selected && styles.segmentFallback]}
          >
            <Text numberOfLines={2} style={[styles.label, selected && styles.labelSelected]}>
              {option.label}
            </Text>
          </PressableFeedback>
        )
      })}
    </View>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    track: {
      backgroundColor: colors.surfaceSubtle,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 14,
      borderWidth: 1,
      flexDirection: 'row',
      gap: GAP,
      padding: PADDING
    },
    indicator: {
      backgroundColor: colors.surface,
      borderCurve: 'continuous',
      borderRadius: 10,
      bottom: PADDING,
      boxShadow: '0 1px 3px rgba(35, 39, 65, 0.12)',
      left: PADDING,
      position: 'absolute',
      top: PADDING
    },
    segment: {
      alignItems: 'center',
      borderCurve: 'continuous',
      borderRadius: 10,
      flex: 1,
      justifyContent: 'center',
      minHeight: 40,
      paddingHorizontal: 10
    },
    segmentFallback: { backgroundColor: colors.surface },
    label: { color: colors.muted, fontSize: 14, fontWeight: '600', textAlign: 'center' },
    labelSelected: { color: colors.primaryInk, fontWeight: '700' }
  })

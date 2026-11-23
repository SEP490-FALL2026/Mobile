import { StyleSheet, Text, View } from 'react-native'

import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { PressableFeedback } from './pressable-feedback'

interface SegmentedControlProps<T extends string> {
  accessibilityLabel?: string
  disabled?: boolean
  onChange: (value: T) => void
  options: readonly { label: string; value: T }[]
  value: T
}

// Two or three mutually exclusive views of the same list, shown as one track with a raised active segment.
export function SegmentedControl<T extends string>({
  accessibilityLabel,
  disabled,
  onChange,
  options,
  value
}: SegmentedControlProps<T>) {
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  return (
    <View accessibilityLabel={accessibilityLabel} style={styles.track}>
      {options.map((option) => {
        const selected = option.value === value
        return (
          <PressableFeedback
            key={option.value}
            accessibilityRole='button'
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => {
              if (!selected) onChange(option.value)
            }}
            style={[styles.segment, selected && styles.segmentSelected]}
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
      gap: 4,
      padding: 4
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
    segmentSelected: {
      backgroundColor: colors.surface,
      boxShadow: '0 1px 3px rgba(35, 39, 65, 0.12)'
    },
    label: { color: colors.muted, fontSize: 14, fontWeight: '600', textAlign: 'center' },
    labelSelected: { color: colors.primaryInk, fontWeight: '700' }
  })

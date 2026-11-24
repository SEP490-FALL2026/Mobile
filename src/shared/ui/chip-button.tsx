import { Feather } from '@expo/vector-icons'
import { StyleSheet, Text } from 'react-native'

import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { PressableFeedback } from './pressable-feedback'

type FeatherIconName = keyof typeof Feather.glyphMap

interface ChipButtonProps {
  disabled?: boolean
  icon: FeatherIconName
  label: string
  onPress: () => void
}

// A visible secondary action (refresh, reload) that stands out from plain text links.
export function ChipButton({ disabled, icon, label, onPress }: ChipButtonProps) {
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  return (
    <PressableFeedback
      accessibilityLabel={label}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={[styles.chip, disabled && styles.disabled]}
    >
      <Feather
        accessibilityElementsHidden
        color={colors.primaryInk}
        importantForAccessibility='no'
        name={icon}
        size={16}
      />
      <Text style={styles.label}>{label}</Text>
    </PressableFeedback>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    chip: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: colors.primarySoft,
      borderCurve: 'continuous',
      borderRadius: 12,
      flexDirection: 'row',
      gap: 8,
      minHeight: 44,
      paddingHorizontal: 14
    },
    label: { color: colors.primaryInk, fontSize: 14, fontWeight: '700' },
    disabled: { opacity: 0.5 }
  })

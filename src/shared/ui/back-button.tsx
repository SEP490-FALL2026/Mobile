import { Feather } from '@expo/vector-icons'
import { StyleSheet, Text } from 'react-native'

import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { PressableFeedback } from './pressable-feedback'

interface BackButtonProps {
  disabled?: boolean
  label: string
  onPress: () => void
  // `chip` marks a step inside a screen so it reads differently from the screen-level back link.
  variant?: 'link' | 'chip'
}

export function BackButton({ disabled, label, onPress, variant = 'link' }: BackButtonProps) {
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  const chip = variant === 'chip'
  return (
    <PressableFeedback
      accessibilityLabel={label}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={[styles.base, chip ? styles.chip : styles.link, disabled && styles.disabled]}
    >
      <Feather
        accessibilityElementsHidden
        color={colors.primaryInk}
        importantForAccessibility='no'
        name='chevron-left'
        size={20}
      />
      <Text style={styles.label}>{label}</Text>
    </PressableFeedback>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    base: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 2, minHeight: 44 },
    link: { marginLeft: -6 },
    chip: {
      backgroundColor: colors.primarySoft,
      borderCurve: 'continuous',
      borderRadius: 12,
      paddingLeft: 6,
      paddingRight: 14
    },
    label: { color: colors.primaryInk, fontSize: 15, fontWeight: '700' },
    disabled: { opacity: 0.5 }
  })

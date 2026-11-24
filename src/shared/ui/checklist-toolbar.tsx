import { Feather } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

import { selectionHaptic } from '@/shared/native/haptics'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { PressableFeedback } from './pressable-feedback'

interface ChecklistToolbarProps {
  allYes: boolean
  answerAllLabel: string
  disabled?: boolean
  expanded: boolean
  onAnswerAll: () => void
  onToggle: () => void
  progressLabel: string
  toggleLabel: string
}

// Collapse control, answered/total progress and a "Yes to all" shortcut shared by every policy checklist.
export function ChecklistToolbar({
  allYes,
  answerAllLabel,
  disabled,
  expanded,
  onAnswerAll,
  onToggle,
  progressLabel,
  toggleLabel
}: ChecklistToolbarProps) {
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  return (
    <View style={styles.row}>
      <PressableFeedback
        accessibilityLabel={toggleLabel}
        accessibilityRole='button'
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={styles.toggle}
      >
        <Feather color={colors.muted} name={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
        <Text style={styles.progress}>{progressLabel}</Text>
      </PressableFeedback>
      <PressableFeedback
        accessibilityRole='button'
        accessibilityState={{ checked: allYes, disabled }}
        disabled={disabled}
        onPress={() => {
          selectionHaptic()
          onAnswerAll()
        }}
        style={[styles.answerAll, allYes && styles.answerAllSelected, disabled && styles.disabled]}
      >
        <Feather color={allYes ? colors.onPrimary : colors.primaryInk} name='check-circle' size={16} />
        <Text style={[styles.answerAllText, allYes && styles.answerAllTextSelected]}>{answerAllLabel}</Text>
      </PressableFeedback>
    </View>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    row: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
    toggle: { alignItems: 'center', flexDirection: 'row', gap: 6, minHeight: 44 },
    progress: { color: colors.muted, fontSize: 13, fontWeight: '600' },
    answerAll: {
      alignItems: 'center',
      backgroundColor: colors.primarySoft,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 6,
      minHeight: 44,
      paddingHorizontal: 12
    },
    answerAllSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
    answerAllText: { color: colors.primaryInk, fontSize: 13, fontWeight: '700' },
    answerAllTextSelected: { color: colors.onPrimary },
    disabled: { opacity: 0.5 }
  })

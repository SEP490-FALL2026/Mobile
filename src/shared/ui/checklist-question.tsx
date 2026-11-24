import { Feather } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { PressableFeedback } from './pressable-feedback'

type Answer = 'YES' | 'NO'

interface ChecklistQuestionProps {
  answer?: Answer
  choiceRole?: 'button' | 'radio'
  disabled?: boolean
  noLabel: string
  onAnswer: (answer: Answer) => void
  system: boolean
  systemLabel: string
  text: string
  yesLabel: string
}

// One policy checklist question: the text, then either the system's own answer or a Yes / No choice.
export function ChecklistQuestion({
  answer,
  choiceRole = 'button',
  disabled,
  noLabel,
  onAnswer,
  system,
  systemLabel,
  text,
  yesLabel
}: ChecklistQuestionProps) {
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  return (
    <View style={styles.question}>
      <Text style={styles.text}>{text}</Text>
      {system ? (
        <View style={styles.systemRow}>
          <Feather
            accessibilityElementsHidden
            color={colors.success}
            importantForAccessibility='no'
            name='check'
            size={14}
          />
          <Text style={styles.systemText}>{systemLabel}</Text>
        </View>
      ) : (
        <View style={styles.choiceRow}>
          {(
            [
              ['YES', yesLabel],
              ['NO', noLabel]
            ] as const
          ).map(([value, label]) => {
            const selected = answer === value
            return (
              <PressableFeedback
                key={value}
                accessibilityRole={choiceRole}
                accessibilityState={{
                  disabled,
                  selected,
                  ...(choiceRole === 'radio' ? { checked: selected } : {})
                }}
                disabled={disabled}
                onPress={() => onAnswer(value)}
                style={[styles.choice, selected && styles.choiceSelected, disabled && styles.disabled]}
              >
                <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text>
              </PressableFeedback>
            )
          })}
        </View>
      )}
    </View>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    question: { borderTopColor: colors.border, borderTopWidth: 1, gap: 9, paddingTop: 11, paddingBottom: 2 },
    text: { color: colors.foreground, fontSize: 14, lineHeight: 20 },
    systemRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
    systemText: { color: colors.success, fontSize: 12, fontWeight: '700' },
    choiceRow: { flexDirection: 'row', gap: 8 },
    choice: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSubtle,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 10,
      borderWidth: 1,
      justifyContent: 'center',
      minHeight: 44,
      minWidth: 84,
      paddingHorizontal: 14,
      paddingVertical: 7
    },
    choiceSelected: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
    choiceText: { color: colors.foreground, fontSize: 13, fontWeight: '600' },
    choiceTextSelected: { color: colors.primaryInk, fontWeight: '700' },
    disabled: { opacity: 0.5 }
  })

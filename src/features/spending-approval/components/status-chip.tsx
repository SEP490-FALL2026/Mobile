import { StyleSheet, Text, View } from 'react-native'

import { mobileColors } from '@/shared/theme/colors'

import type { Tone } from '../model/spending-approvals'

const tones: Record<Tone, { background: string; color: string }> = {
  danger: { background: mobileColors.dangerSoft, color: mobileColors.danger },
  neutral: { background: mobileColors.surfaceSubtle, color: mobileColors.muted },
  success: { background: mobileColors.successSoft, color: mobileColors.success },
  warning: { background: mobileColors.warningBackground, color: mobileColors.warning }
}

export function StatusChip({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  return (
    <View style={[styles.chip, { backgroundColor: tones[tone].background }]}>
      <Text style={[styles.label, { color: tones[tone].color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  chip: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  label: { fontSize: 11, fontWeight: '700' }
})

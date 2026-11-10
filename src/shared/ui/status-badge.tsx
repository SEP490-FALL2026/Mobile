import { StyleSheet, Text, View } from 'react-native'

import { mobileColors } from '@/shared/theme/colors'

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'brand'

const tones: Record<BadgeTone, { background: string; color: string }> = {
  brand: { background: mobileColors.primarySoft, color: mobileColors.primaryInk },
  danger: { background: mobileColors.dangerSoft, color: mobileColors.danger },
  neutral: { background: mobileColors.surfaceSubtle, color: mobileColors.muted },
  success: { background: mobileColors.successSoft, color: mobileColors.success },
  warning: { background: mobileColors.warningBackground, color: mobileColors.warning }
}

export function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) {
  return (
    <View style={[styles.badge, { backgroundColor: tones[tone].background }]}>
      <Text style={[styles.label, { color: tones[tone].color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  label: { fontSize: 11, fontWeight: '700' }
})

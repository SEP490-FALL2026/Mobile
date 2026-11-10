import type { PropsWithChildren } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { mobileColors } from '@/shared/theme/colors'

export function DetailCard({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <View style={styles.card}>
      {title ? (
        <Text accessibilityRole='header' style={styles.cardTitle}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  )
}

export function Field({ emphasized, label, value }: { emphasized?: boolean; label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, emphasized && styles.emphasized]}>{value}</Text>
    </View>
  )
}

export const detailStyles = StyleSheet.create({
  muted: { color: mobileColors.muted, fontSize: 13, lineHeight: 19 },
  error: { color: mobileColors.danger, fontSize: 13, lineHeight: 19 }
})

const styles = StyleSheet.create({
  card: {
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 18,
    borderWidth: 1,
    boxShadow: '0px 4px 10px rgba(93, 59, 32, 0.035)',
    gap: 10,
    padding: 16
  },
  cardTitle: { color: mobileColors.foreground, fontSize: 15, fontWeight: '700' },
  emphasized: { fontSize: 17, fontWeight: '700' },
  field: { gap: 2 },
  label: { color: mobileColors.muted, fontSize: 12 },
  value: { color: mobileColors.foreground, fontSize: 14, lineHeight: 20 }
})

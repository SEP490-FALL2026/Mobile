import { StyleSheet, Text, View } from 'react-native'

import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { SentryMascot } from './sentry-mascot'

interface EmptyStateProps {
  title: string
  hint?: string
}

// Nothing to show: the idle mascot, a title and an optional hint.
export function EmptyState({ title, hint }: EmptyStateProps) {
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  return (
    <View style={styles.container}>
      <SentryMascot mood='idle' size={72} />
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSubtle,
      borderCurve: 'continuous',
      borderRadius: 16,
      gap: 8,
      padding: 22
    },
    title: { color: colors.foreground, fontSize: 14, fontWeight: '700', textAlign: 'center' },
    hint: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' }
  })

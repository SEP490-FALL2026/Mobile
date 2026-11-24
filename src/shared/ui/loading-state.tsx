import { StyleSheet, Text, View } from 'react-native'

import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { SentryMascot } from './sentry-mascot'

// Whole-screen loading: the hopping mascot above the message (the message keeps the progressbar role).
export function LoadingState({ label }: { label: string }) {
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  return (
    <View style={styles.container}>
      <SentryMascot mood='hop' size={72} />
      <Text accessibilityRole='progressbar' style={styles.label}>
        {label}
      </Text>
    </View>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    container: { alignItems: 'center', gap: 8, paddingVertical: 24 },
    label: { color: colors.muted, fontSize: 14, textAlign: 'center' }
  })

import { StyleSheet, View } from 'react-native'

import type { IconTone } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { SaasIcon, type SaasIconName } from './saas-icon'

interface IconBadgeProps {
  name: SaasIconName
  tone: IconTone
  size?: number
}

// A coloured rounded square holding a white icon, used on tiles and card headers (never in small UI such as
// the tab bar).
export function IconBadge({ name, tone, size = 44 }: IconBadgeProps) {
  const { colors } = useMobileTheme()
  const solid = colors.tones[tone].solid
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: solid,
          borderRadius: Math.round(size * 0.32),
          boxShadow: `0 6px 14px ${solid}55`,
          height: size,
          width: size
        }
      ]}
    >
      <SaasIcon color='#ffffff' name={name} size={Math.round(size * 0.56)} />
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { alignItems: 'center', borderCurve: 'continuous', justifyContent: 'center' }
})

import { Feather } from '@expo/vector-icons'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, {
  Easing,
  ReduceMotion,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import { selectionHaptic } from '@/shared/native/haptics'

import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

type FeatherIconName = keyof typeof Feather.glyphMap

export interface MobileTab {
  accessibilityLabel: string
  icon: FeatherIconName
  id: string
  label: string
  onPress?: () => void
  selected: boolean
  disabled?: boolean
  accessibilityHint?: string
  badge?: number
}

interface MobileTabBarProps {
  accessibilityLabel: string
  tabs: MobileTab[]
}

// The active pill grows and fades in behind the icon instead of switching on abruptly.
function TabIndicator({ selected, color }: { selected: boolean; color: string }) {
  const progress = useSharedValue(selected ? 1 : 0)
  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System
    })
  }, [progress, selected])
  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.6, 1]) }]
  }))
  return <Animated.View pointerEvents='none' style={[indicatorBase, { backgroundColor: color }, style]} />
}

const indicatorBase = {
  borderRadius: 16,
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0
} as const

export function MobileTabBar({ accessibilityLabel, tabs }: MobileTabBarProps) {
  const { colors: mobileColors } = useMobileTheme()
  const styles = createStyles(mobileColors)
  const insets = useSafeAreaInsets()
  // A floating pill above the home indicator rather than a bar glued to the screen edge.
  return (
    <View style={[styles.dock, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View accessibilityLabel={accessibilityLabel} accessibilityRole='tablist' style={styles.container}>
        {tabs.map((tab) => (
          <PressableFeedback
            accessibilityLabel={tab.accessibilityLabel}
            accessibilityHint={tab.accessibilityHint}
            accessibilityRole='tab'
            accessibilityState={{ selected: tab.selected, disabled: tab.disabled }}
            disabled={tab.disabled}
            key={tab.id}
            onPress={() => {
              if (!tab.selected) selectionHaptic()
              tab.onPress?.()
            }}
            style={[styles.tab, tab.disabled && styles.tabDisabled]}
          >
            <View style={styles.iconContainer}>
              <TabIndicator color={mobileColors.primarySoft} selected={tab.selected} />
              <Feather
                accessibilityElementsHidden
                color={tab.selected ? mobileColors.primaryInk : mobileColors.muted}
                importantForAccessibility='no'
                name={tab.icon}
                size={20}
              />
              {tab.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge > 99 ? '99+' : tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text
              maxFontSizeMultiplier={1.15}
              numberOfLines={1}
              style={[styles.label, tab.selected && styles.labelSelected]}
            >
              {tab.label}
            </Text>
          </PressableFeedback>
        ))}
      </View>
    </View>
  )
}

const createStyles = (mobileColors: MobileColors) =>
  StyleSheet.create({
    badge: {
      position: 'absolute',
      top: -2,
      right: -4,
      minWidth: 16,
      height: 16,
      borderCurve: 'continuous',
      borderRadius: 8,
      paddingHorizontal: 4,
      backgroundColor: mobileColors.danger,
      alignItems: 'center',
      justifyContent: 'center'
    },
    badgeText: { color: mobileColors.onDanger, fontSize: 11, fontWeight: '700' },
    dock: { backgroundColor: mobileColors.backgroundEnd, paddingHorizontal: 16, paddingTop: 6 },
    container: {
      backgroundColor: mobileColors.sidebar,
      borderColor: mobileColors.border,
      borderCurve: 'continuous',
      borderRadius: 26,
      borderWidth: 1,
      boxShadow: '0 10px 28px rgba(20, 24, 60, 0.14)',
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 6,
      paddingVertical: 6
    },
    iconContainer: {
      alignItems: 'center',
      height: 32,
      justifyContent: 'center',
      width: 60
    },
    label: {
      color: mobileColors.muted,
      fontSize: 12,
      fontWeight: '500',
      marginTop: 1,
      textAlign: 'center'
    },
    labelSelected: {
      color: mobileColors.primaryInk,
      fontWeight: '700'
    },
    tab: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      minHeight: 56
    },
    tabDisabled: {
      opacity: 0.5
    }
  })

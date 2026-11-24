import { type PropsWithChildren, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

interface CollapsibleProps {
  expanded: boolean
}

// Height-and-fade disclosure. The content stays mounted (so it keeps its state) and is hidden from assistive
// technology while collapsed. Natural height is used whenever it is not animating, so content can still grow.
export function Collapsible({ expanded, children }: PropsWithChildren<CollapsibleProps>) {
  const [measured, setMeasured] = useState<number>()
  const [settled, setSettled] = useState(true)
  const progress = useSharedValue(expanded ? 1 : 0)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setSettled(false)
    progress.value = withTiming(
      expanded ? 1 : 0,
      { duration: 220, easing: Easing.out(Easing.cubic), reduceMotion: ReduceMotion.System },
      (finished) => {
        if (finished) runOnJS(setSettled)(true)
      }
    )
  }, [expanded, progress])

  const animatedStyle = useAnimatedStyle(() => {
    if (measured === undefined) return { opacity: progress.value }
    return { height: measured * progress.value, opacity: progress.value }
  }, [measured])

  const naturalHeight = settled && expanded
  return (
    <Animated.View
      accessibilityElementsHidden={!expanded}
      importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
      pointerEvents={expanded ? 'auto' : 'none'}
      style={[naturalHeight ? undefined : animatedStyle, { overflow: 'hidden' }, naturalHeight && { opacity: 1 }]}
    >
      <View onLayout={(event) => setMeasured(event.nativeEvent.layout.height)}>{children}</View>
    </Animated.View>
  )
}

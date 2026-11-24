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
// technology while collapsed. The natural height is only re-measured while the section is fully open and
// idle; measuring while it is collapsed or moving would feed a squashed height back into the animation.
export function Collapsible({ expanded, children }: PropsWithChildren<CollapsibleProps>) {
  const [measured, setMeasured] = useState<number>()
  const progress = useSharedValue(expanded ? 1 : 0)
  const animating = useRef(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    animating.current = true
    progress.value = withTiming(
      expanded ? 1 : 0,
      { duration: 220, easing: Easing.out(Easing.cubic), reduceMotion: ReduceMotion.System },
      (finished) => {
        if (finished) runOnJS(finish)()
      }
    )
    function finish() {
      animating.current = false
    }
  }, [expanded, progress])

  const collapsedFirst = measured === undefined && !expanded
  const animatedStyle = useAnimatedStyle(() => {
    if (collapsedFirst) return { height: 0, opacity: 0 }
    if (measured === undefined) return { opacity: progress.value }
    return { height: measured * progress.value, opacity: progress.value }
  }, [measured, collapsedFirst])

  return (
    <Animated.View
      accessibilityElementsHidden={!expanded}
      importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
      pointerEvents={expanded ? 'auto' : 'none'}
      style={[animatedStyle, { overflow: 'hidden' }]}
    >
      <View
        onLayout={(event) => {
          if (expanded && !animating.current) setMeasured(event.nativeEvent.layout.height)
        }}
      >
        {children}
      </View>
    </Animated.View>
  )
}

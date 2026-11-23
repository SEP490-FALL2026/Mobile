import { Pressable, type PressableProps } from 'react-native'

// Pressable with a consistent pressed state, so every tappable surface acknowledges the touch.
export function PressableFeedback({ style, disabled, ...props }: PressableProps) {
  return (
    <Pressable
      disabled={disabled}
      style={(state) => [
        typeof style === 'function' ? style(state) : style,
        state.pressed && !disabled && { opacity: 0.7 }
      ]}
      {...props}
    />
  )
}

import { type Ref, useCallback, useEffect, useRef } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  TextInput
} from 'react-native'

type KeyboardAwareScrollViewProps = ScrollViewProps & { ref?: Ref<ScrollView> }

// A ScrollView for screens with text fields. While the keyboard is open the content keeps room for it and the
// focused field is scrolled above it, so people can see what they type. Android draws edge-to-edge (SDK 54), so
// the window no longer shrinks for the keyboard and a KeyboardAvoidingView supplies the space instead.
export function KeyboardAwareScrollView({ ref, children, ...props }: KeyboardAwareScrollViewProps) {
  const scroll = useRef<ScrollView | null>(null)
  const setRef = useCallback(
    (node: ScrollView | null) => {
      scroll.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  useEffect(() => {
    // iOS scrolls the focused field into view itself through automaticallyAdjustKeyboardInsets.
    if (Platform.OS !== 'android') return
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      const input = TextInput.State.currentlyFocusedInput()
      if (input) scroll.current?.scrollResponderScrollNativeHandleToKeyboard(input, 32, true)
    })
    return () => subscription.remove()
  }, [])

  const content = (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps='handled'
      ref={setRef}
      {...props}
    >
      {children}
    </ScrollView>
  )
  if (Platform.OS !== 'android') return content
  return (
    <KeyboardAvoidingView behavior='padding' style={styles.fill}>
      {content}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({ fill: { flex: 1 } })

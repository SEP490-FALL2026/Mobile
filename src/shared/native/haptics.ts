import * as Haptics from 'expo-haptics'
import { Platform } from 'react-native'

// Haptics are punctuation: one light tick per user action, never the only feedback, silent where unsupported.
function run(action: () => Promise<void>) {
  if (Platform.OS === 'web') return
  void action().catch(() => undefined)
}

export function selectionHaptic() {
  run(() => Haptics.selectionAsync())
}

export function impactHaptic() {
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light))
}

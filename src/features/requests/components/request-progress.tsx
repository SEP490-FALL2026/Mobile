import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import { mobileColors } from '@/shared/theme/colors'

import type { ProgressStep, StepStatus } from '../model/request-progress'

const icons: Record<StepStatus, keyof typeof Feather.glyphMap> = {
  current: 'clock',
  done: 'check',
  failed: 'x',
  pending: 'circle',
  skipped: 'minus'
}

export function RequestProgress({ steps }: { steps: ProgressStep[] }) {
  const { t } = useTranslation()
  return (
    <View accessibilityLabel={t('requests.live.progress.title')} style={styles.list}>
      {steps.map((step, index) => (
        <View key={step.key} style={styles.row}>
          <View style={styles.rail}>
            <View style={[styles.dot, styles[step.status]]}>
              <Feather
                accessibilityElementsHidden
                color={step.status === 'pending' || step.status === 'skipped' ? mobileColors.muted : mobileColors.white}
                importantForAccessibility='no'
                name={icons[step.status]}
                size={13}
              />
            </View>
            {index < steps.length - 1 ? <View style={styles.line} /> : null}
          </View>
          <View style={styles.copy}>
            <Text style={[styles.label, step.status === 'pending' && styles.muted]}>
              {t(`requests.live.progress.steps.${step.key}`)}
            </Text>
            <Text style={styles.status}>
              {t(`requests.live.progress.status.${step.status}`)}
              {step.note ? ` · ${t(`requests.live.progress.notes.${step.note}`)}` : ''}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  copy: { flex: 1, paddingBottom: 14 },
  current: { backgroundColor: mobileColors.primary },
  done: { backgroundColor: mobileColors.success },
  dot: { alignItems: 'center', borderRadius: 13, height: 26, justifyContent: 'center', width: 26 },
  failed: { backgroundColor: mobileColors.danger },
  label: { color: mobileColors.foreground, fontSize: 14, fontWeight: '700' },
  line: { backgroundColor: mobileColors.border, flex: 1, marginVertical: 2, width: 2 },
  list: { gap: 0 },
  muted: { color: mobileColors.muted },
  pending: { backgroundColor: mobileColors.surfaceSubtle, borderColor: mobileColors.border, borderWidth: 1 },
  rail: { alignItems: 'center', width: 26 },
  row: { flexDirection: 'row', gap: 12 },
  skipped: { backgroundColor: mobileColors.surfaceSubtle, borderColor: mobileColors.border, borderWidth: 1 },
  status: { color: mobileColors.muted, fontSize: 12, lineHeight: 18 }
})

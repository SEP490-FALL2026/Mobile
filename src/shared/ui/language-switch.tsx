import { useTranslation } from 'react-i18next'
import { StyleSheet, Text } from 'react-native'

import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import { setAppLanguage, type SupportedLanguage } from '@/shared/i18n/i18n'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

export function LanguageSwitch() {
  const { i18n, t } = useTranslation()
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  const current: SupportedLanguage = i18n.resolvedLanguage?.split('-')[0] === 'en' ? 'en' : 'vi'
  const next: SupportedLanguage = current === 'vi' ? 'en' : 'vi'
  const nextName = t(next === 'vi' ? 'common.language.vietnamese' : 'common.language.english')

  return (
    <PressableFeedback
      accessibilityLabel={t('common.language.switchTo', { language: nextName })}
      accessibilityRole='button'
      onPress={() => void setAppLanguage(next)}
      style={styles.trigger}
    >
      <Text style={styles.label}>
        {t(current === 'vi' ? 'common.language.vietnameseShort' : 'common.language.englishShort')}
      </Text>
    </PressableFeedback>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    trigger: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 22,
      borderWidth: 1,
      height: 44,
      justifyContent: 'center',
      width: 44
    },
    label: { color: colors.primaryInk, fontSize: 13, fontWeight: '800' }
  })

import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { mobileColors } from '@/shared/theme/colors'

interface PagerProps {
  onPage: (page: number) => void
  page: number
  totalPages: number
}

export function Pager({ onPage, page, totalPages }: PagerProps) {
  const { i18n, t } = useTranslation()
  const atStart = page <= 1
  const atEnd = page >= totalPages

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel={t('licenses.live.previous')}
        accessibilityRole='button'
        accessibilityState={{ disabled: atStart }}
        disabled={atStart}
        onPress={() => onPage(page - 1)}
        style={[styles.button, atStart && styles.disabled]}
      >
        <Feather
          accessibilityElementsHidden
          color={mobileColors.primaryInk}
          importantForAccessibility='no'
          name='chevron-left'
          size={16}
        />
        <Text style={styles.label}>{t('licenses.live.previous')}</Text>
      </Pressable>
      <Text style={styles.page}>
        {t('licenses.live.page', { page: new Intl.NumberFormat(i18n.language).format(page) })}
      </Text>
      <Pressable
        accessibilityLabel={t('licenses.live.next')}
        accessibilityRole='button'
        accessibilityState={{ disabled: atEnd }}
        disabled={atEnd}
        onPress={() => onPage(page + 1)}
        style={[styles.button, atEnd && styles.disabled]}
      >
        <Text style={styles.label}>{t('licenses.live.next')}</Text>
        <Feather
          accessibilityElementsHidden
          color={mobileColors.primaryInk}
          importantForAccessibility='no'
          name='chevron-right'
          size={16}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12
  },
  disabled: { opacity: 0.4 },
  label: { color: mobileColors.primaryInk, fontSize: 13, fontWeight: '700' },
  page: { color: mobileColors.muted, fontSize: 12 },
  row: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }
})

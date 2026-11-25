import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { PressableFeedback } from './pressable-feedback'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  disabled?: boolean
}

// Previous / "page x of y" / next for server-paginated lists. Renders nothing for a single page.
export function Pagination({ page, totalPages, onChange, disabled = false }: PaginationProps) {
  const { t, i18n } = useTranslation()
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  if (totalPages <= 1) return null
  const format = new Intl.NumberFormat(i18n.language)
  const canPrevious = !disabled && page > 1
  const canNext = !disabled && page < totalPages
  return (
    <View style={styles.row}>
      <PressableFeedback
        accessibilityLabel={t('common.pagination.previous')}
        accessibilityRole='button'
        accessibilityState={{ disabled: !canPrevious }}
        disabled={!canPrevious}
        onPress={() => onChange(page - 1)}
        style={[styles.button, !canPrevious && styles.disabled]}
      >
        <Feather
          accessibilityElementsHidden
          color={colors.primaryInk}
          importantForAccessibility='no'
          name='chevron-left'
          size={18}
        />
        <Text style={styles.buttonText}>{t('common.pagination.previous')}</Text>
      </PressableFeedback>
      <Text style={styles.status}>
        {t('common.pagination.status', { page: format.format(page), total: format.format(totalPages) })}
      </Text>
      <PressableFeedback
        accessibilityLabel={t('common.pagination.next')}
        accessibilityRole='button'
        accessibilityState={{ disabled: !canNext }}
        disabled={!canNext}
        onPress={() => onChange(page + 1)}
        style={[styles.button, !canNext && styles.disabled]}
      >
        <Text style={styles.buttonText}>{t('common.pagination.next')}</Text>
        <Feather
          accessibilityElementsHidden
          color={colors.primaryInk}
          importantForAccessibility='no'
          name='chevron-right'
          size={18}
        />
      </PressableFeedback>
    </View>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    row: { alignItems: 'center', flexDirection: 'row', gap: 8, justifyContent: 'space-between', paddingVertical: 4 },
    button: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 14,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 2,
      minHeight: 44,
      paddingHorizontal: 12
    },
    buttonText: { color: colors.primaryInk, fontSize: 14, fontWeight: '700' },
    status: { color: colors.muted, flexShrink: 1, fontSize: 13, fontWeight: '600', textAlign: 'center' },
    disabled: { opacity: 0.4 }
  })

import { Feather } from '@expo/vector-icons'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { mobileColors } from '@/shared/theme/colors'

interface QueueSectionProps {
  emptyHint: string
  emptyTitle: string
  errorText: string
  hasItems: boolean
  hint: string
  isError: boolean
  isLoading: boolean
  onPage: (page: number) => void
  onRefresh: () => void
  page: number
  title: string
  totalItems?: number
  totalPages?: number
}

export function QueueSection({
  children,
  emptyHint,
  emptyTitle,
  errorText,
  hasItems,
  hint,
  isError,
  isLoading,
  onPage,
  onRefresh,
  page,
  title,
  totalItems,
  totalPages = 1
}: PropsWithChildren<QueueSectionProps>) {
  const { i18n, t } = useTranslation()
  const format = new Intl.NumberFormat(i18n.language)

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <View style={styles.copy}>
          <Text accessibilityRole='header' style={styles.title}>
            {title}
          </Text>
          <Text style={styles.muted}>{hint}</Text>
        </View>
        {totalItems !== undefined ? (
          <View accessibilityLabel={t('spending.assignedLabel', { count: totalItems })} style={styles.count}>
            <Text style={styles.countText}>{format.format(totalItems)}</Text>
          </View>
        ) : null}
      </View>

      <Pressable
        accessibilityRole='button'
        accessibilityState={{ disabled: isLoading }}
        disabled={isLoading}
        onPress={onRefresh}
        style={styles.refresh}
      >
        <Feather
          accessibilityElementsHidden
          color={mobileColors.primaryInk}
          importantForAccessibility='no'
          name='refresh-cw'
          size={14}
        />
        <Text style={styles.refreshText}>{t('spending.refresh')}</Text>
      </Pressable>

      {isLoading ? (
        <Text accessibilityRole='progressbar' style={styles.muted}>
          {t('spending.loading')}
        </Text>
      ) : null}
      {isError ? (
        <View style={styles.error}>
          <Text accessibilityRole='alert' style={styles.errorText}>
            {errorText}
          </Text>
          <Pressable accessibilityRole='button' onPress={onRefresh} style={styles.refresh}>
            <Text style={styles.refreshText}>{t('spending.retry')}</Text>
          </Pressable>
          {page > 1 ? (
            <Pressable accessibilityRole='button' onPress={() => onPage(page - 1)} style={styles.refresh}>
              <Text style={styles.refreshText}>{t('licenses.live.previous')}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {!isLoading && !isError && !hasItems ? (
        <View style={styles.empty}>
          <Feather
            accessibilityElementsHidden
            color={mobileColors.success}
            importantForAccessibility='no'
            name='check-circle'
            size={26}
          />
          <Text style={styles.emptyTitle}>{emptyTitle}</Text>
          <Text style={styles.emptyHint}>{emptyHint}</Text>
        </View>
      ) : null}

      {children}

      {totalPages > 1 ? (
        <View style={styles.pagination}>
          <Pressable
            accessibilityRole='button'
            accessibilityState={{ disabled: page <= 1 }}
            disabled={page <= 1}
            onPress={() => onPage(page - 1)}
            style={[styles.refresh, page <= 1 && styles.disabled]}
          >
            <Text style={styles.refreshText}>{t('licenses.live.previous')}</Text>
          </Pressable>
          <Text style={styles.muted}>{t('licenses.live.page', { page: format.format(page) })}</Text>
          <Pressable
            accessibilityRole='button'
            accessibilityState={{ disabled: page >= totalPages }}
            disabled={page >= totalPages}
            onPress={() => onPage(page + 1)}
            style={[styles.refresh, page >= totalPages && styles.disabled]}
          >
            <Text style={styles.refreshText}>{t('licenses.live.next')}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  copy: { flex: 1, gap: 3 },
  count: {
    alignItems: 'center',
    backgroundColor: mobileColors.primarySoft,
    borderRadius: 12,
    justifyContent: 'center',
    minWidth: 34,
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  countText: { color: mobileColors.primaryInk, fontSize: 13, fontWeight: '700' },
  disabled: { opacity: 0.4 },
  empty: {
    alignItems: 'center',
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 24
  },
  emptyHint: { color: mobileColors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  emptyTitle: { color: mobileColors.foreground, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  error: { gap: 2 },
  errorText: { color: mobileColors.danger, fontSize: 13, lineHeight: 19 },
  heading: { alignItems: 'flex-start', flexDirection: 'row', gap: 10 },
  muted: { color: mobileColors.muted, fontSize: 12, lineHeight: 18 },
  pagination: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  refresh: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 44
  },
  refreshText: { color: mobileColors.primaryInk, fontSize: 13, fontWeight: '700' },
  section: { gap: 10 },
  title: { color: mobileColors.foreground, fontSize: 17, fontWeight: '700' }
})

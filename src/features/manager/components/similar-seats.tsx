import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { Pagination } from '@/shared/ui/pagination'

import { useSimilarSeats } from '../hooks/use-similar-seats'

export function SimilarSeats({ requestId }: { requestId: string }) {
  const { colors: mobileColors } = useMobileTheme()
  const styles = createStyles(mobileColors)
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const seats = useSimilarSeats(requestId, page)

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t('manager.live.similarTitle')}</Text>
      {seats.isLoading ? <Text style={styles.muted}>{t('manager.live.similarLoading')}</Text> : null}
      {seats.isError ? (
        <PressableFeedback accessibilityRole='button' onPress={() => void seats.refetch()} style={styles.action}>
          <Text accessibilityRole='alert' style={styles.error}>
            {t('manager.live.similarError')}
          </Text>
          <Text style={styles.link}>{t('licenses.live.retry')}</Text>
        </PressableFeedback>
      ) : null}
      {!seats.isError && seats.data?.items.length === 0 ? (
        <Text style={styles.muted}>{t('manager.live.similarEmpty')}</Text>
      ) : null}
      {!seats.isError
        ? seats.data?.items.map((seat) => (
            <View key={seat.assignmentId} style={styles.item}>
              <Text style={styles.value}>{seat.plan.applicationName}</Text>
              <Text style={styles.muted}>{t('licenses.live.plan', { plan: seat.plan.planName })}</Text>
            </View>
          ))
        : null}
      {seats.data && seats.data.pagination.totalPages > 1 ? (
        <Pagination onChange={setPage} page={page} totalPages={seats.data.pagination.totalPages} />
      ) : null}
    </View>
  )
}

const createStyles = (mobileColors: MobileColors) =>
  StyleSheet.create({
    section: { borderTopWidth: 1, borderTopColor: mobileColors.border, marginTop: 8, paddingTop: 12, gap: 8 },
    title: { color: mobileColors.foreground, fontSize: 16, fontWeight: '700' },
    item: {
      backgroundColor: mobileColors.surfaceSubtle,
      borderCurve: 'continuous',
      borderRadius: 10,
      padding: 10,
      gap: 3
    },
    value: { color: mobileColors.foreground, fontSize: 14, lineHeight: 20 },
    muted: { color: mobileColors.muted, fontSize: 13, lineHeight: 19 },
    error: { color: mobileColors.danger, fontSize: 13, lineHeight: 19 },
    link: { color: mobileColors.primaryInk, fontWeight: '700' },
    action: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' },
    disabled: { opacity: 0.4 }
  })

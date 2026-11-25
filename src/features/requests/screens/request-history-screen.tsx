import { Redirect, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useSession } from '@/shared/api/session-context'
import { goBackOr } from '@/shared/lib/go-back-or'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { BackButton } from '@/shared/ui/back-button'

import { RequestTimeline } from '../components/request-timeline'

// The full event history of one request, kept off the detail screen so the detail stays short.
export function RequestHistoryScreen({ requestId }: { requestId: string }) {
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  const { t } = useTranslation()
  const router = useRouter()
  const session = useSession()

  if (session.state === 'anonymous') return <Redirect href='/' />
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton
          label={t('common.back')}
          onPress={() => goBackOr(router, { pathname: '/live-requests/[requestId]', params: { requestId } })}
        />
        <Text accessibilityRole='header' style={styles.title}>
          {t('requests.live.timeline.title')}
        </Text>
        <RequestTimeline requestId={requestId} showTitle={false} />
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, paddingBottom: 24, gap: 14 },
    title: { color: colors.foreground, fontSize: 25, fontWeight: '700' }
  })

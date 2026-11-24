import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Modal, StyleSheet, Text, View } from 'react-native'

import { apiErrorInfo } from '@/shared/api/api-error'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { ErrorReference } from '@/shared/ui/error-reference'
import { PressableFeedback } from '@/shared/ui/pressable-feedback'

import type { RequestWithdrawFlow } from '../hooks/use-request-withdraw'
import { LiveRequestStatus } from './live-request-status'

// "Withdraw" action for the top-right corner of the request detail.
export function RequestWithdrawButton({ flow }: { flow: RequestWithdrawFlow }) {
  const { t } = useTranslation()
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  return (
    <PressableFeedback
      accessibilityLabel={t('requests.createLive.withdraw')}
      accessibilityRole='button'
      accessibilityState={{ disabled: flow.inFlight }}
      disabled={flow.inFlight}
      hitSlop={6}
      onPress={flow.open}
      style={[styles.trigger, flow.inFlight && styles.disabled]}
    >
      <Feather
        accessibilityElementsHidden
        color={colors.danger}
        importantForAccessibility='no'
        name='corner-up-left'
        size={16}
      />
      <Text style={styles.triggerText}>{t('requests.createLive.withdraw')}</Text>
    </PressableFeedback>
  )
}

// Confirmation popup: nothing is sent until the user confirms.
export function RequestWithdrawDialog({ flow }: { flow: RequestWithdrawFlow }) {
  const { t } = useTranslation()
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  return (
    <Modal animationType='fade' onRequestClose={flow.close} statusBarTranslucent transparent visible={flow.confirming}>
      <View style={styles.backdrop}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <View style={styles.dialogIcon}>
            <Feather
              accessibilityElementsHidden
              color={colors.danger}
              importantForAccessibility='no'
              name='alert-circle'
              size={26}
            />
          </View>
          <Text accessibilityRole='header' style={styles.dialogTitle}>
            {t('requests.createLive.confirmWithdraw')}
          </Text>
          <Text style={styles.dialogNote}>{t('requests.createLive.withdrawNote')}</Text>
          <View style={styles.dialogActions}>
            <PressableFeedback
              accessibilityRole='button'
              accessibilityState={{ disabled: flow.inFlight }}
              disabled={flow.inFlight}
              onPress={flow.close}
              style={[styles.cancel, flow.inFlight && styles.disabled]}
            >
              <Text style={styles.cancelText}>{t('requests.cancel')}</Text>
            </PressableFeedback>
            <PressableFeedback
              accessibilityRole='button'
              accessibilityState={{ disabled: flow.inFlight, busy: flow.inFlight }}
              disabled={flow.inFlight}
              onPress={flow.confirm}
              style={[styles.confirm, flow.inFlight && styles.disabled]}
            >
              <Text style={styles.confirmText}>{t('requests.createLive.withdrawAction')}</Text>
            </PressableFeedback>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// Outcome of the last withdrawal attempt, shown in the body of the detail.
export function RequestWithdrawResult({ flow }: { flow: RequestWithdrawFlow }) {
  const { t } = useTranslation()
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  const { withdrawal } = flow
  if (!withdrawal.isError && !withdrawal.isSuccess) return null
  return (
    <View style={styles.card}>
      {withdrawal.isError ? (
        <>
          <Text accessibilityRole='alert' style={styles.error}>
            {t(
              apiErrorInfo(withdrawal.error).code === 'ACCESS_REQUEST.WITHDRAWAL_AFTER_DECISION'
                ? 'requests.createLive.withdrawAfterDecision'
                : 'requests.createLive.withdrawError'
            )}
          </Text>
          <ErrorReference error={withdrawal.error} />
        </>
      ) : null}
      {withdrawal.isSuccess ? (
        <View accessibilityRole='summary' style={styles.result}>
          <Text style={styles.muted}>{t('requests.createLive.withdrawSuccess')}</Text>
          <Text style={styles.muted}>{t('requests.createLive.withdrawResultState')}</Text>
          <LiveRequestStatus state={withdrawal.data.state} />
        </View>
      ) : null}
    </View>
  )
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    trigger: {
      alignItems: 'center',
      borderColor: colors.danger,
      borderCurve: 'continuous',
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 6,
      minHeight: 44,
      paddingHorizontal: 12
    },
    triggerText: { color: colors.danger, fontSize: 14, fontWeight: '700' },
    disabled: { opacity: 0.5 },
    backdrop: {
      alignItems: 'center',
      backgroundColor: 'rgba(15, 18, 38, 0.5)',
      flex: 1,
      justifyContent: 'center',
      padding: 24
    },
    dialog: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderCurve: 'continuous',
      borderRadius: 22,
      boxShadow: '0 12px 40px rgba(15, 18, 38, 0.25)',
      gap: 10,
      maxWidth: 400,
      padding: 22,
      width: '100%'
    },
    dialogIcon: {
      alignItems: 'center',
      backgroundColor: colors.dangerBackground,
      borderRadius: 28,
      height: 56,
      justifyContent: 'center',
      width: 56
    },
    dialogTitle: { color: colors.foreground, fontSize: 18, fontWeight: '800', textAlign: 'center' },
    dialogNote: { color: colors.muted, fontSize: 14, lineHeight: 20, textAlign: 'center' },
    dialogActions: { alignSelf: 'stretch', flexDirection: 'row', gap: 10, marginTop: 8 },
    cancel: {
      alignItems: 'center',
      borderColor: colors.border,
      borderCurve: 'continuous',
      borderRadius: 12,
      borderWidth: 1,
      flex: 1,
      justifyContent: 'center',
      minHeight: 48
    },
    cancelText: { color: colors.foreground, fontSize: 15, fontWeight: '700' },
    confirm: {
      alignItems: 'center',
      backgroundColor: colors.danger,
      borderCurve: 'continuous',
      borderRadius: 12,
      flex: 1,
      justifyContent: 'center',
      minHeight: 48
    },
    confirmText: { color: colors.onDanger, fontSize: 15, fontWeight: '700' },
    card: {
      backgroundColor: colors.white,
      borderColor: colors.border,
      borderWidth: 1,
      borderCurve: 'continuous',
      borderRadius: 20,
      padding: 18,
      gap: 8
    },
    result: { gap: 6 },
    muted: { color: colors.muted, fontSize: 13, lineHeight: 19 },
    error: { color: colors.danger, fontSize: 13 }
  })

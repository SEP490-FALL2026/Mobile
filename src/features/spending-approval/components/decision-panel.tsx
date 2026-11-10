import { Feather } from '@expo/vector-icons'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import { mobileColors } from '@/shared/theme/colors'

import { type DecisionErrorKey, maxReasonLength } from '../model/spending-approvals'

interface DecisionPanelProps {
  /** Localized reason the approval is not offered, e.g. a term over twelve months. */
  approveBlocked?: string
  canDecide: boolean
  errorKey?: DecisionErrorKey
  onSubmit: (decision: 'APPROVE' | 'REJECT', reason?: string) => void
  pending: boolean
  succeeded: boolean
}

export function DecisionPanel({
  approveBlocked,
  canDecide,
  errorKey,
  onSubmit,
  pending,
  succeeded
}: DecisionPanelProps) {
  const { t } = useTranslation()
  const [choice, setChoice] = useState<'APPROVE' | 'REJECT'>()
  const [reason, setReason] = useState('')
  const [invalid, setInvalid] = useState(false)
  const sent = useRef(false)
  const locked = pending || succeeded || !!errorKey

  function confirm() {
    if (!choice || !canDecide || locked || sent.current) return
    if (choice === 'APPROVE' && approveBlocked) return
    const trimmed = reason.trim()
    if (choice === 'REJECT' && (trimmed.length < 1 || trimmed.length > maxReasonLength)) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    sent.current = true
    onSubmit(choice, choice === 'REJECT' ? trimmed : undefined)
  }

  return (
    <View style={styles.panel}>
      {succeeded ? (
        <View accessibilityRole='summary' style={[styles.banner, styles.bannerSuccess]}>
          <Feather
            accessibilityElementsHidden
            importantForAccessibility='no'
            color={mobileColors.success}
            name='check-circle'
            size={18}
          />
          <Text style={styles.bannerSuccessText}>{t('spending.decision.saved')}</Text>
        </View>
      ) : null}
      {errorKey ? (
        <View accessibilityRole='alert' style={[styles.banner, styles.bannerError]}>
          <Feather
            accessibilityElementsHidden
            importantForAccessibility='no'
            color={mobileColors.danger}
            name='alert-circle'
            size={18}
          />
          <Text style={styles.bannerErrorText}>{t(`spending.errors.${errorKey}`)}</Text>
        </View>
      ) : null}
      {!canDecide && !locked ? (
        <View accessibilityRole='alert' style={[styles.banner, styles.bannerError]}>
          <Feather
            accessibilityElementsHidden
            importantForAccessibility='no'
            color={mobileColors.danger}
            name='info'
            size={18}
          />
          <Text style={styles.bannerErrorText}>{t('spending.decision.stale')}</Text>
        </View>
      ) : null}
      {approveBlocked && canDecide && !locked ? <Text style={styles.warning}>{approveBlocked}</Text> : null}

      {canDecide && !locked && !choice ? (
        <View style={styles.actions}>
          <Pressable
            accessibilityLabel={t('spending.decision.reject')}
            accessibilityRole='button'
            onPress={() => setChoice('REJECT')}
            style={[styles.button, styles.reject]}
          >
            <Feather
              accessibilityElementsHidden
              importantForAccessibility='no'
              color={mobileColors.danger}
              name='x'
              size={17}
            />
            <Text style={styles.rejectText}>{t('spending.decision.reject')}</Text>
          </Pressable>
          <Pressable
            accessibilityLabel={t('spending.decision.approve')}
            accessibilityRole='button'
            accessibilityState={{ disabled: !!approveBlocked }}
            disabled={!!approveBlocked}
            onPress={() => setChoice('APPROVE')}
            style={[styles.button, styles.approve, !!approveBlocked && styles.disabled]}
          >
            <Feather
              accessibilityElementsHidden
              importantForAccessibility='no'
              color={mobileColors.white}
              name='check'
              size={17}
            />
            <Text style={styles.approveText}>{t('spending.decision.approve')}</Text>
          </Pressable>
        </View>
      ) : null}

      {choice && !succeeded && !errorKey ? (
        <View style={styles.confirm}>
          <Text style={styles.confirmTitle}>
            {t(choice === 'APPROVE' ? 'spending.decision.confirmApprove' : 'spending.decision.confirmReject')}
          </Text>
          <Text style={styles.hint}>{t('spending.decision.confirmNote')}</Text>
          {choice === 'REJECT' ? (
            <>
              <Text style={styles.label}>{t('spending.decision.reasonLabel')}</Text>
              <TextInput
                accessibilityLabel={t('spending.decision.reasonLabel')}
                editable={!locked}
                maxLength={maxReasonLength}
                multiline
                onChangeText={(text) => {
                  setReason(text)
                  setInvalid(false)
                }}
                placeholder={t('spending.decision.reasonPlaceholder')}
                placeholderTextColor={mobileColors.muted}
                style={styles.input}
                value={reason}
              />
              {invalid ? (
                <Text accessibilityRole='alert' style={styles.invalid}>
                  {t('spending.decision.reasonRequired')}
                </Text>
              ) : null}
            </>
          ) : null}
          <View style={styles.actions}>
            <Pressable
              accessibilityRole='button'
              accessibilityState={{ disabled: locked }}
              disabled={locked}
              onPress={() => setChoice(undefined)}
              style={[styles.button, styles.reject, locked && styles.disabled]}
            >
              <Text style={styles.cancelText}>{t('spending.decision.cancel')}</Text>
            </Pressable>
            <Pressable
              accessibilityRole='button'
              accessibilityState={{ busy: pending, disabled: locked || !canDecide }}
              disabled={locked || !canDecide}
              onPress={confirm}
              style={[
                styles.button,
                choice === 'REJECT' ? styles.rejectSolid : styles.approve,
                (locked || !canDecide) && styles.disabled
              ]}
            >
              <Text style={styles.approveText}>
                {pending ? t('spending.decision.sending') : t('spending.decision.confirm')}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 10 },
  approve: { backgroundColor: mobileColors.primary, flex: 1 },
  approveText: { color: mobileColors.white, fontSize: 14, fontWeight: '700' },
  banner: { alignItems: 'center', borderRadius: 12, flexDirection: 'row', gap: 9, padding: 12 },
  bannerError: { backgroundColor: mobileColors.dangerSoft },
  bannerErrorText: { color: mobileColors.danger, flex: 1, fontSize: 13, lineHeight: 19 },
  bannerSuccess: { backgroundColor: mobileColors.successSoft },
  bannerSuccessText: { color: mobileColors.success, flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 19 },
  button: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 16
  },
  cancelText: { color: mobileColors.foreground, fontSize: 14, fontWeight: '700' },
  confirm: { borderTopColor: mobileColors.border, borderTopWidth: 1, gap: 10, paddingTop: 14 },
  confirmTitle: { color: mobileColors.foreground, fontSize: 15, fontWeight: '700' },
  disabled: { opacity: 0.4 },
  hint: { color: mobileColors.muted, fontSize: 12, lineHeight: 18 },
  input: {
    borderColor: mobileColors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: mobileColors.foreground,
    fontSize: 15,
    minHeight: 96,
    padding: 12,
    textAlignVertical: 'top'
  },
  invalid: { color: mobileColors.danger, fontSize: 12 },
  label: { color: mobileColors.muted, fontSize: 12, fontWeight: '600' },
  panel: { gap: 12 },
  reject: { backgroundColor: mobileColors.white, borderColor: mobileColors.border, borderWidth: 1, flex: 1 },
  rejectSolid: { backgroundColor: mobileColors.danger, flex: 1 },
  rejectText: { color: mobileColors.danger, fontSize: 14, fontWeight: '700' },
  warning: { color: mobileColors.warning, fontSize: 12, lineHeight: 18 }
})

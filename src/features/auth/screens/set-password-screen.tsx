import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import { useMobileTheme } from '@/shared/theme/theme-provider'
import { ErrorReference } from '@/shared/ui/error-reference'

import { AuthFormLayout, authFormStyles } from '../components/auth-form-layout'
import { PasswordField } from '../components/password-field'
import { passwordErrorKey, useSetPassword, validNewPassword } from '../hooks/use-password-actions'

type Props = { token: string | undefined; purpose: 'invitation' | 'reset' }

export function SetPasswordScreen({ token, purpose }: Props) {
  const { t } = useTranslation()
  const { colors } = useMobileTheme()
  const styles = authFormStyles(colors)
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [validation, setValidation] = useState(false)
  const setter = useSetPassword(purpose)
  const failure = setter.isError ? passwordErrorKey(setter.error) : undefined
  const tooShort = validation && !validNewPassword(password)
  const mismatch = validation && password !== confirmation

  function submit() {
    if (!token || setter.isPending) return
    if (!validNewPassword(password) || password !== confirmation) {
      setValidation(true)
      return
    }
    setValidation(false)
    setter.mutate({ token, password })
  }

  const title = t(`auth.setPassword.${purpose}.title`)
  if (!token || failure === 'linkInvalid') {
    return (
      <AuthFormLayout title={title}>
        <Text accessibilityRole='alert' style={styles.error}>
          {t(`auth.setPassword.${purpose}.invalidLink`)}
        </Text>
        <PressableFeedback accessibilityRole='button' onPress={() => router.replace('/')} style={styles.button}>
          <Text style={styles.buttonText}>{t('auth.forgot.backToLogin')}</Text>
        </PressableFeedback>
        {purpose === 'reset' ? (
          <PressableFeedback accessibilityRole='button' onPress={() => router.replace('/forgot-password')}>
            <Text style={styles.link}>{t('auth.setPassword.requestNewLink')}</Text>
          </PressableFeedback>
        ) : null}
      </AuthFormLayout>
    )
  }
  if (setter.isSuccess) {
    return (
      <AuthFormLayout title={title}>
        <Text accessibilityRole='summary' style={styles.notice}>
          {t(`auth.setPassword.${purpose}.done`)}
        </Text>
        <PressableFeedback accessibilityRole='button' onPress={() => router.replace('/')} style={styles.button}>
          <Text style={styles.buttonText}>{t('auth.setPassword.goToLogin')}</Text>
        </PressableFeedback>
      </AuthFormLayout>
    )
  }

  return (
    <AuthFormLayout title={title} subtitle={t('auth.setPassword.rules')}>
      <PasswordField
        autoComplete='new-password'
        editable={!setter.isPending}
        error={tooShort ? t('auth.setPassword.tooShort') : undefined}
        label={t('auth.setPassword.newPassword')}
        onChangeText={setPassword}
        value={password}
      />
      <PasswordField
        autoComplete='new-password'
        editable={!setter.isPending}
        error={mismatch ? t('auth.setPassword.mismatch') : undefined}
        label={t('auth.setPassword.confirm')}
        onChangeText={setConfirmation}
        value={confirmation}
      />
      {failure ? (
        <>
          <Text accessibilityRole='alert' style={styles.error}>
            {t(`auth.errors.password.${failure}`)}
          </Text>
          <ErrorReference error={setter.error} />
        </>
      ) : null}
      <PressableFeedback
        accessibilityRole='button'
        accessibilityState={{ disabled: setter.isPending, busy: setter.isPending }}
        disabled={setter.isPending}
        onPress={submit}
        style={[styles.button, setter.isPending && styles.disabled]}
      >
        <Text style={styles.buttonText}>{setter.isPending ? t('auth.loading') : t('auth.setPassword.submit')}</Text>
      </PressableFeedback>
    </AuthFormLayout>
  )
}

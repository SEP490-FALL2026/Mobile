import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import type { MySoftwarePageResponseDtoDataItemsItem } from '@/shared/api/generated/model/me'
import { MySoftwarePageResponseDtoDataItemsItemStatus } from '@/shared/api/generated/model/me'
import { mobileColors } from '@/shared/theme/colors'
import { StatusBadge } from '@/shared/ui/status-badge'

export function LiveSoftwareCard({ item }: { item: MySoftwarePageResponseDtoDataItemsItem }) {
  const { t, i18n } = useTranslation()
  const status = Object.values(MySoftwarePageResponseDtoDataItemsItemStatus).includes(item.status)
    ? t(`licenses.live.status.${item.status}`)
    : t('licenses.live.unknownStatus', { status: item.status })
  const formatDate = (value: string) => {
    const date = new Date(`${value}T00:00:00Z`)
    return Number.isNaN(date.getTime())
      ? t('licenses.live.dateUnavailable')
      : new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeZone: 'UTC' }).format(date)
  }

  return (
    <View style={[styles.card, item.expiringSoon && styles.cardWarning]}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <Text style={styles.initial}>{item.application.name.trim().slice(0, 1).toLocaleUpperCase()}</Text>
        </View>
        <View style={styles.copy}>
          <Text numberOfLines={1} style={styles.name}>
            {item.application.name}
          </Text>
          <Text numberOfLines={1} style={styles.secondary}>
            {t('licenses.live.plan', { plan: item.plan.name })}
          </Text>
        </View>
        <StatusBadge
          label={status}
          tone={item.expiringSoon ? 'warning' : item.status === 'ACTIVE' ? 'success' : 'neutral'}
        />
      </View>
      <View style={styles.details}>
        <Detail icon='settings' text={t('licenses.live.provisioning', { type: item.provisioningType })} />
        <Detail icon='play-circle' text={t('licenses.live.start', { date: formatDate(item.effectiveFrom) })} />
        {item.expectedEndDate ? (
          <Detail icon='flag' text={t('licenses.live.end', { date: formatDate(item.expectedEndDate) })} />
        ) : null}
      </View>
      {item.expiringSoon ? (
        <View style={styles.warning}>
          <Feather
            accessibilityElementsHidden
            color={mobileColors.warning}
            importantForAccessibility='no'
            name='alert-triangle'
            size={14}
          />
          <Text style={styles.warningText}>{t('licenses.live.expiringSoon')}</Text>
        </View>
      ) : null}
    </View>
  )
}

function Detail({ icon, text }: { icon: keyof typeof Feather.glyphMap; text: string }) {
  return (
    <View style={styles.detail}>
      <Feather
        accessibilityElementsHidden
        color={mobileColors.muted}
        importantForAccessibility='no'
        name={icon}
        size={13}
      />
      <Text style={styles.secondary}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 12,
    boxShadow: '0px 4px 10px rgba(93, 59, 32, 0.04)'
  },
  cardWarning: { borderColor: '#f1cf8d' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    backgroundColor: mobileColors.primarySoft,
    borderRadius: 14,
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center'
  },
  initial: { color: mobileColors.primaryInk, fontSize: 18, fontWeight: '800' },
  copy: { flex: 1, minWidth: 0, gap: 2 },
  name: { color: mobileColors.foreground, fontSize: 15, fontWeight: '700' },
  secondary: { color: mobileColors.muted, fontSize: 12, lineHeight: 18 },
  details: { gap: 6, borderTopColor: mobileColors.border, borderTopWidth: 1, paddingTop: 10 },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: mobileColors.warningBackground,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  warningText: { color: mobileColors.warning, fontSize: 12, fontWeight: '600', flex: 1 }
})

import { useTranslation } from 'react-i18next'

import { MobileTabBar } from '@/shared/ui/mobile-tab-bar'

type ManagerTab = 'queue' | 'spend' | 'group' | 'inbox'

export function ManagerLiveTabs({
  active,
  disabled,
  onSelect
}: {
  active: ManagerTab
  disabled: boolean
  onSelect: (tab: ManagerTab) => void
}) {
  const { t } = useTranslation()
  return (
    <MobileTabBar
      accessibilityLabel={t('navigation.tabs')}
      tabs={[
        {
          id: 'queue',
          label: t('manager.tabs.queue'),
          icon: 'check-square',
          selected: active === 'queue',
          disabled,
          onPress: () => onSelect('queue'),
          accessibilityLabel: t('navigation.openTab', { tab: t('manager.tabs.queue') })
        },
        {
          id: 'spend',
          label: t('manager.live.spendTab'),
          icon: 'send',
          selected: active === 'spend',
          disabled,
          onPress: () => onSelect('spend'),
          accessibilityLabel: t('navigation.openTab', { tab: t('manager.live.spendTab') })
        },
        {
          id: 'group',
          label: t('manager.live.groupTab'),
          icon: 'users',
          selected: active === 'group',
          disabled,
          onPress: () => onSelect('group'),
          accessibilityLabel: t('navigation.openTab', { tab: t('manager.live.groupTab') })
        },
        {
          id: 'inbox',
          label: t('navigation.inbox'),
          icon: 'bell',
          selected: active === 'inbox',
          disabled,
          onPress: () => onSelect('inbox'),
          accessibilityLabel: t('navigation.openTab', { tab: t('navigation.inbox') })
        }
      ]}
    />
  )
}

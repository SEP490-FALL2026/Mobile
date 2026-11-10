import { useTranslation } from 'react-i18next'

import { MobileTabBar } from '@/shared/ui/mobile-tab-bar'

export type SpendingTab = 'spend' | 'manager' | 'inbox'

export function SpendingTabs({
  active,
  disabled,
  onSelect
}: {
  active: SpendingTab
  disabled: boolean
  onSelect: (tab: SpendingTab) => void
}) {
  const { t } = useTranslation()
  const tabs = [
    { id: 'spend', icon: 'credit-card', label: t('spending.tabs.spend') },
    { id: 'manager', icon: 'users', label: t('spending.tabs.manager') },
    { id: 'inbox', icon: 'bell', label: t('navigation.inbox') }
  ] as const

  return (
    <MobileTabBar
      accessibilityLabel={t('navigation.tabs')}
      tabs={tabs.map((tab) => ({
        accessibilityLabel: t('navigation.openTab', { tab: tab.label }),
        disabled,
        icon: tab.icon,
        id: tab.id,
        label: tab.label,
        onPress: () => onSelect(tab.id),
        selected: active === tab.id
      }))}
    />
  )
}

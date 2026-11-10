import { useTranslation } from 'react-i18next'

import { MyRequestsPageResponseDtoDataItemsItemState } from '@/shared/api/generated/model/me'
import { type BadgeTone, StatusBadge } from '@/shared/ui/status-badge'

const tones: Record<string, BadgeTone> = {
  COMPLETED: 'success',
  REJECTED: 'danger',
  IT_REJECTED: 'danger',
  FAILED: 'danger',
  WITHDRAWN: 'neutral',
  CANCELLED: 'neutral'
}

export function LiveRequestStatus({ state }: { state: string }) {
  const { t } = useTranslation()
  const known = Object.values(MyRequestsPageResponseDtoDataItemsItemState).find((value) => value === state)
  return (
    <StatusBadge
      label={known ? t(`requests.live.states.${known}`) : t('requests.live.unknownState', { state })}
      tone={tones[state] ?? 'brand'}
    />
  )
}

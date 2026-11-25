import { Redirect, useLocalSearchParams } from 'expo-router'

import { RequestHistoryScreen } from '@/features/requests'
import { isUuid } from '@/shared/lib/is-uuid'

export default function RequestHistoryRoute() {
  const { requestId } = useLocalSearchParams<{ requestId?: string | string[] }>()
  if (!isUuid(requestId)) return <Redirect href='/live-requests' />
  return <RequestHistoryScreen requestId={requestId} />
}

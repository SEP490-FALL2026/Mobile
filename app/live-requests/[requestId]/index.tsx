import { Redirect, useLocalSearchParams } from 'expo-router'

import { LiveRequestDetailsScreen } from '@/features/requests'
import { isUuid } from '@/shared/lib/is-uuid'

export default function LiveRequestDetailsRoute() {
  const { requestId } = useLocalSearchParams<{ requestId?: string | string[] }>()
  if (!isUuid(requestId)) return <Redirect href='/live-requests' />
  return <LiveRequestDetailsScreen requestId={requestId} />
}

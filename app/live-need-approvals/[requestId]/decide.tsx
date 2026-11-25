import { Redirect, useLocalSearchParams } from 'expo-router'

import { NeedDecisionScreen } from '@/features/manager'
import { isUuid } from '@/shared/lib/is-uuid'

export default function NeedDecisionRoute() {
  const { requestId } = useLocalSearchParams<{ requestId?: string | string[] }>()
  if (!isUuid(requestId)) return <Redirect href='/live-need-approvals' />
  return <NeedDecisionScreen requestId={requestId} />
}

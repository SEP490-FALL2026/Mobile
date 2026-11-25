import { Redirect, useLocalSearchParams } from 'expo-router'

import { NeedApprovalDetailScreen } from '@/features/manager'
import { isUuid } from '@/shared/lib/is-uuid'

export default function NeedApprovalDetailRoute() {
  const { requestId, source } = useLocalSearchParams<{ requestId?: string | string[]; source?: string }>()
  if (!isUuid(requestId)) return <Redirect href='/live-need-approvals' />
  return <NeedApprovalDetailScreen requestId={requestId} source={source === 'reminder' ? 'reminder' : undefined} />
}

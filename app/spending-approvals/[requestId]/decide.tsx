import { Redirect, useLocalSearchParams } from 'expo-router'

import { SpendingDecisionScreen } from '@/features/spending-approval'
import { isUuid } from '@/shared/lib/is-uuid'

export default function SpendingDecisionRoute() {
  const { requestId } = useLocalSearchParams<{ requestId?: string | string[] }>()
  if (!isUuid(requestId)) return <Redirect href='/spending-approvals' />
  return <SpendingDecisionScreen requestId={requestId} />
}

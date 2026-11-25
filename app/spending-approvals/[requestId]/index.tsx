import { Redirect, useLocalSearchParams } from 'expo-router'

import { SpendingApprovalDetailScreen } from '@/features/spending-approval'
import { isUuid } from '@/shared/lib/is-uuid'

export default function SpendingApprovalDetailRoute() {
  const { requestId } = useLocalSearchParams<{ requestId?: string | string[] }>()
  if (!isUuid(requestId)) return <Redirect href='/spending-approvals' />
  return <SpendingApprovalDetailScreen requestId={requestId} />
}

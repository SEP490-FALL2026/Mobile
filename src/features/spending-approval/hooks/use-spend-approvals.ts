import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  spendApprovalDecide,
  spendApprovalGet,
  spendApprovalList
} from '@/shared/api/generated/operations/spend-approvals'
import type { SpendDecisionBodyDto } from '@/shared/api/generated/model/spend-approvals'
import { useSession } from '@/shared/api/session-context'

const pageSize = 20

export function useSpendQueue(page: number, permitted: boolean) {
  const session = useSession()
  return useQuery({
    queryKey: ['session', 'spend-approvals', page],
    enabled: session.state === 'authenticated' && permitted,
    queryFn: ({ signal }) =>
      session.read(async (token) => {
        const result = await spendApprovalList(
          { page, pageSize },
          { headers: { Authorization: `Bearer ${token}` } },
          signal
        )
        if (!result.data) throw new Error('Missing spend approval queue')
        return result.data
      })
  })
}

export function useSpendDetail(requestId: string | undefined, permitted: boolean) {
  const session = useSession()
  return useQuery({
    queryKey: ['session', 'spend-approval-detail', requestId],
    enabled: session.state === 'authenticated' && permitted && !!requestId,
    queryFn: ({ signal }) =>
      session.read(async (token) => {
        if (!requestId) throw new Error('Missing request ID')
        const result = await spendApprovalGet(requestId, { headers: { Authorization: `Bearer ${token}` } }, signal)
        const detail = result.data?.spendApproval
        if (!detail || detail.requestId !== requestId) throw new Error('Missing or inconsistent spend approval')
        return detail
      })
  })
}

export function useSpendDecision() {
  const session = useSession()
  const client = useQueryClient()
  return useMutation({
    retry: false,
    mutationFn: ({ id, body }: { id: string; body: SpendDecisionBodyDto }) =>
      session.write(async (token) => {
        const result = await spendApprovalDecide(id, body, { headers: { Authorization: `Bearer ${token}` } })
        const decision = result.data?.spendApproval.decision
        const expected = body.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED'
        if (result.data?.spendApproval.requestId !== id || decision?.decision !== expected) {
          throw new Error('Missing or inconsistent decision response')
        }
        return result.data.spendApproval
      }),
    onSettled: async (_, __, { id }) => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['session', 'spend-approvals'] }),
        client.invalidateQueries({ queryKey: ['session', 'spend-approval-detail', id] }),
        client.invalidateQueries({ queryKey: ['session', 'request', id] }),
        client.invalidateQueries({ queryKey: ['session', 'notifications'] })
      ])
    }
  })
}

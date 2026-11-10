import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { accessRequestGet, accessRequestNeedDecide } from '@/shared/api/generated/operations/access-requests'
import { needDecisionList } from '@/shared/api/generated/operations/need-decisions'
import type { NeedDecisionBodyDto } from '@/shared/api/generated/model/access-requests'
import { useSession } from '@/shared/api/session-context'

/**
 * One-step requests of a head (need + spend in one decision) that the backend routes to the
 * signed-in spending approver. The backend scopes the queue to the caller's assigned steps.
 */
export function useManagerRequestApprovals(page: number, requestId: string | undefined, permitted: boolean) {
  const session = useSession()
  const client = useQueryClient()
  const enabled = session.state === 'authenticated' && permitted
  const queue = useQuery({
    queryKey: ['session', 'manager-request-approvals', page],
    enabled,
    queryFn: ({ signal }) =>
      session.read(async (token) => {
        const result = await needDecisionList(
          { type: 'GRANT', page, pageSize: 20 },
          { headers: { Authorization: `Bearer ${token}` } },
          signal
        )
        if (!result.data) throw new Error('Missing manager request queue')
        return result.data
      })
  })
  const detail = useQuery({
    queryKey: ['session', 'manager-request-detail', requestId],
    enabled: enabled && !!requestId,
    queryFn: ({ signal }) =>
      session.read(async (token) => {
        if (!requestId) throw new Error('Missing request ID')
        const result = await accessRequestGet(requestId, { headers: { Authorization: `Bearer ${token}` } }, signal)
        if (!result.data || !('request' in result.data) || result.data.request.id !== requestId) {
          throw new Error('Missing or inconsistent request details')
        }
        return result.data.request
      })
  })
  const decision = useMutation({
    retry: false,
    mutationFn: ({ id, body }: { id: string; body: NeedDecisionBodyDto }) =>
      session.write(async (token) => {
        const result = await accessRequestNeedDecide(id, body, { headers: { Authorization: `Bearer ${token}` } })
        const request = result.data?.request
        const expected = body.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED'
        if (!request || request.id !== id || request.needDecision?.decision !== expected) {
          throw new Error('Missing or inconsistent decision response')
        }
        return request
      }),
    onSettled: async (_, __, { id }) => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['session', 'manager-request-approvals'] }),
        client.invalidateQueries({ queryKey: ['session', 'manager-request-detail', id] }),
        client.invalidateQueries({ queryKey: ['session', 'request', id] }),
        client.invalidateQueries({ queryKey: ['session', 'notifications'] })
      ])
    }
  })
  return { queue, detail, decision }
}

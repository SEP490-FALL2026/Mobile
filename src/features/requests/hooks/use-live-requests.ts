import { useQuery } from '@tanstack/react-query'

import { accessRequestGet } from '@/shared/api/generated/operations/access-requests'
import { meAccessRequestList } from '@/shared/api/generated/operations/me'
import { useSession } from '@/shared/api/session-context'

export type RequestInvolvement = 'SENT' | 'FOR_ME'

export function useLiveRequests(view: 'open' | 'ended', page: number, involvement: RequestInvolvement = 'SENT') {
  const session = useSession()
  return useQuery({
    queryKey: ['session', 'requests', view, involvement, page],
    enabled: session.state === 'authenticated',
    queryFn: ({ signal }) =>
      session.read(async (token) => {
        const result = await meAccessRequestList(
          { view, involvement, page, pageSize: 20 },
          { headers: { Authorization: `Bearer ${token}` } },
          signal
        )
        if (!result.data) throw new Error('Missing request list')
        return result.data
      })
  })
}

export function useLiveRequest(requestId: string) {
  const session = useSession()
  return useQuery({
    queryKey: ['session', 'request', requestId],
    enabled: session.state === 'authenticated',
    queryFn: ({ signal }) =>
      session.read(async (token) => {
        const result = await accessRequestGet(requestId, { headers: { Authorization: `Bearer ${token}` } }, signal)
        if (!result.data) throw new Error('Missing request details')
        return result.data
      })
  })
}

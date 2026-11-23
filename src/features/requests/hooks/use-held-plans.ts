import { useQuery } from '@tanstack/react-query'

import { meSoftwareRightList } from '@/shared/api/generated/api/me/me'
import { useSession } from '@/shared/api/session-context'

// The catalog cannot say which plans the caller already holds, so the current rights are matched by plan.
// Only unambiguous holdings count; the request preview and the server stay authoritative (GH-1).
const HELD_STATUSES = new Set(['UPCOMING', 'PROVISIONING', 'ACTIVE'])
const PAGE_SIZE = 100
const MAX_PAGES = 5

export function useHeldPlans() {
  const session = useSession()
  const query = useQuery({
    queryKey: ['session', 'held-plans'],
    enabled: session.state === 'authenticated',
    retry: false,
    queryFn: ({ signal }) =>
      session.read(async (token) => {
        const held = new Map<string, string>()
        for (let page = 1; page <= MAX_PAGES; page += 1) {
          const result = await meSoftwareRightList(
            { view: 'current', page, pageSize: PAGE_SIZE },
            { signal, headers: { Authorization: `Bearer ${token}` } }
          )
          const data = result.data.data
          if (!data) throw new Error('Missing software response data')
          for (const item of data.items) {
            if (HELD_STATUSES.has(item.status) && !held.has(item.plan.id)) held.set(item.plan.id, item.assignmentId)
          }
          if (page >= data.pagination.totalPages) break
        }
        return held
      })
  })
  // A failed lookup only loses the badge; the preview still blocks a duplicate request.
  return query.data ?? new Map<string, string>()
}

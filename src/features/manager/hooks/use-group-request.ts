import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  groupRequestCandidateList,
  groupRequestCheck,
  groupRequestSubmit
} from '@/shared/api/generated/operations/group-requests'
import { requestablePlanList } from '@/shared/api/generated/operations/requestable-software'
import type { GroupBodyDto } from '@/shared/api/generated/model/group-requests'
import { useSession } from '@/shared/api/session-context'

export function useGroupRequest(planSearch: string, planPage: number, peopleSearch: string, peoplePage: number) {
  const session = useSession()
  const client = useQueryClient()
  const enabled = session.state === 'authenticated'
  const plans = useQuery({
    queryKey: ['session', 'group-plans', planSearch, planPage],
    enabled,
    queryFn: ({ signal }) =>
      session.read(async (token) => {
        const result = await requestablePlanList(
          { search: planSearch || undefined, page: planPage, pageSize: 10 },
          { headers: { Authorization: `Bearer ${token}` } },
          signal
        )
        if (!result.data) throw new Error('Missing requestable plans')
        return result.data
      })
  })
  const people = useQuery({
    queryKey: ['session', 'group-candidates', peopleSearch, peoplePage],
    enabled,
    queryFn: ({ signal }) =>
      session.read(async (token) => {
        const result = await groupRequestCandidateList(
          { q: peopleSearch || undefined, page: peoplePage, pageSize: 10 },
          { headers: { Authorization: `Bearer ${token}` } },
          signal
        )
        if (!result.data) throw new Error('Missing group candidates')
        return result.data
      })
  })
  const check = useMutation({
    retry: false,
    mutationFn: (body: GroupBodyDto) =>
      session.write(async (token) => {
        const result = await groupRequestCheck(body, { headers: { Authorization: `Bearer ${token}` } })
        if (!result.data) throw new Error('Missing group check')
        return { input: body, check: result.data }
      })
  })
  const submit = useMutation({
    retry: false,
    mutationFn: (body: GroupBodyDto) =>
      session.write(async (token) => {
        const result = await groupRequestSubmit(body, { headers: { Authorization: `Bearer ${token}` } })
        const id = result.data?.request.id
        if (!id || !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) {
          throw new Error('Missing or invalid created request ID')
        }
        return id
      }),
    onSettled: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['session', 'requests'] }),
        client.invalidateQueries({ queryKey: ['session', 'spend-queue'] })
      ])
    }
  })
  return { plans, people, check, submit }
}

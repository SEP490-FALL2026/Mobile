import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { spendBatchSubmit, spendQueueList } from '@/shared/api/generated/operations/spend-submission'
import type { SubmitBatchBodyDto } from '@/shared/api/generated/model/spend-submission'
import { useSession } from '@/shared/api/session-context'

/** The head's queue of paid requests (need approved) waiting to be sent on to the spending approver. */
export function useSpendQueue(page: number, permitted: boolean) {
  const session = useSession()
  const client = useQueryClient()
  const queue = useQuery({
    queryKey: ['session', 'spend-queue', page],
    enabled: session.state === 'authenticated' && permitted,
    queryFn: ({ signal }) =>
      session.read(async (token) => {
        const result = await spendQueueList(
          { page, pageSize: 20 },
          { headers: { Authorization: `Bearer ${token}` } },
          signal
        )
        if (!result.data) throw new Error('Missing spend queue')
        return result.data
      })
  })
  const submit = useMutation({
    retry: false,
    mutationFn: (body: SubmitBatchBodyDto) =>
      session.write(async (token) => {
        const created = await spendBatchSubmit(body, { headers: { Authorization: `Bearer ${token}` } })
        const data = created.data
        if (!data?.batch) throw new Error('Missing batch response')
        return { batch: data.batch, results: data.results }
      }),
    onSettled: async () => {
      await client.invalidateQueries({ queryKey: ['session', 'spend-queue'] })
    }
  })
  return { queue, submit }
}

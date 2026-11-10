import { useMutation, useQueryClient } from '@tanstack/react-query'

import { accessRequestWithdraw } from '@/shared/api/generated/operations/access-requests'
import { useSession } from '@/shared/api/session-context'

export function useLiveWithdraw() {
  const session = useSession()
  const client = useQueryClient()
  return useMutation({
    retry: false,
    mutationFn: (id: string) =>
      session.write(async (token) => {
        const result = await accessRequestWithdraw(id, {}, { headers: { Authorization: `Bearer ${token}` } })
        if (!result.data?.request) throw new Error('Missing withdrawal response')
        return result.data.request
      }),
    onSettled: async (_, __, id) => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['session', 'requests'] }),
        client.invalidateQueries({ queryKey: ['session', 'request', id] })
      ])
    }
  })
}

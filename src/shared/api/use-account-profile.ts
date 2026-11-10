import { useQuery } from '@tanstack/react-query'

import { meGet } from '@/shared/api/generated/operations/me'
import { useSession } from '@/shared/api/session-context'

export function useAccountProfile() {
  const session = useSession()
  return useQuery({
    queryKey: ['session', 'me'],
    enabled: session.state === 'authenticated',
    queryFn: ({ signal }) =>
      session.read(async (token) => {
        const result = await meGet({ headers: { Authorization: `Bearer ${token}` } }, signal)
        if (!result.data) throw new Error('Missing account response data')
        return result.data
      })
  })
}

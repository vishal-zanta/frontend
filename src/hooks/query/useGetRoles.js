

import { useQuery } from '@tanstack/react-query'

import { getRoles } from '@/api/roles.api'
import { QUERY_KEYS } from '@/utils/constants'

const useGetRoles = (keys = [], params = {}, enabled = true) => {
  return useQuery({
    queryKey : [QUERY_KEYS.ROLES, ...keys],
    queryFn : () => getRoles(params),
    enabled: enabled
  })
}

export default useGetRoles
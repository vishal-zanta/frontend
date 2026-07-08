

import { useQuery } from '@tanstack/react-query'

import { getRoles } from '@/api/roles.api'
import { QUERY_KEYS } from '@/utils/constants'

const useGetRoles = (keys = [], params = {}) => {
  return useQuery({
    queryKey : [QUERY_KEYS.ROLES, ...keys],
    queryFn : () => getRoles(params),
  })
}

export default useGetRoles
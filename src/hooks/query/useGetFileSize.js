import { useQuery } from '@tanstack/react-query'
import { getConfig } from '@/api/config.api'
import { QUERY_KEYS } from '@/utils/constants'

const useGetFileSize = (keys = [], enabled = true) => {
  return useQuery({
    queryKey : [QUERY_KEYS.CONFIG, ...keys],
    queryFn : () => getConfig(),
    enabled: enabled,
    // gcTime: 60*60*1000, // 1 hour,
    // staleTime: 5*60*60*1000 // 5 hour
  })
}

export default useGetFileSize;

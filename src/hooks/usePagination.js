
import React, { useState } from 'react'

const usePagination = (currPage = 1,  limitOptions = [10,20,50]) => {
    const [page , setPage] = useState(currPage);
    const [limit , setLimit] = useState(limitOptions?.[0]);
  return {page, limit , setPage, setLimit, limitOptions};
}

export default usePagination
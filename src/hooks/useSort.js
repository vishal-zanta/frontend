import React, { useState } from 'react'

const useSort = () => {
    const [sortBy , setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");
  return {sortBy, setSortBy, sortOrder, setSortOrder}
}

export default useSort
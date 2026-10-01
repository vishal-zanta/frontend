import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import isEqual from 'lodash/isEqual'

const isEmpty = (v) =>
  v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)

// state value -> URL value: array => "a,b", anything else => string
const serializeValue = (value) => (Array.isArray(value) ? value.join(',') : String(value))

// Prefixed params from the URL with the prefix stripped: { color: "red,blue" }
const getPrefixedParams = (searchParams, prefix) => {
  const result = {}
  searchParams.forEach((value, k) => {
    if (k.startsWith(prefix)) result[k.slice(prefix.length)] = value
  })
  return result
}

// State -> flat string map, ignoring empty values: { color: "red,blue" }
const serializeState = (state) => {
  const result = {}
  Object.entries(state || {}).forEach(([k, v]) => {
    if (!isEmpty(v)) result[k] = serializeValue(v)
  })
  return result
}

const useSyncSearchParams = (state, setState, key = 'filter.') => {
  const [searchParams, setSearchParams] = useSearchParams()
  const isHydrated = useRef(false)

  useEffect(() => {
    const urlParams = getPrefixedParams(searchParams, key)

    // 1) Initial run: URL -> state (values stay as strings, e.g. "red,blue")
    if (!isHydrated.current) {
      isHydrated.current = true

      if (Object.keys(urlParams).length > 0) {
        if (!isEqual(urlParams, serializeState(state))) {
          setState({ ...state, ...urlParams })
        }
        return // don't overwrite the URL with the not-yet-hydrated state
      }
    }

    // 2) Later runs: state -> URL
    const serialized = serializeState(state)
    if (isEqual(serialized, urlParams)) return // already in sync

    const next = new URLSearchParams(searchParams)

    // remove old prefixed keys
    Array.from(next.keys())
      .filter((k) => k.startsWith(key))
      .forEach((k) => next.delete(k))

    // add current state
    Object.entries(serialized).forEach(([k, v]) => next.set(`${key}${k}`, v))

    setSearchParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])
}

export default useSyncSearchParams
import { useState, useEffect, useCallback } from 'react'
import watchlistService from '../services/watchlistService'

export function useWatchlist() {
  const [watchlistIds, setWatchlistIds] = useState(() => watchlistService.getWatchlistIds())

  const refresh = useCallback(() => {
    setWatchlistIds(watchlistService.getWatchlistIds())
  }, [])

  useEffect(() => {
    const handleStorage = () => refresh()
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [refresh])

  const toggleWatchlist = (movieId) => {
    const res = watchlistService.toggleWatchlist(movieId)
    if (res.success) {
      setWatchlistIds([...res.ids])
    }
    return res
  }

  const isWatchlisted = (movieId) => {
    return watchlistIds.some((id) => String(id) === String(movieId))
  }

  return {
    watchlistIds,
    watchlistCount: watchlistIds.length,
    toggleWatchlist,
    isWatchlisted,
    refresh,
  }
}

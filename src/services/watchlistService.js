const WATCHLIST_KEY = 'movie_marathon_watchlist'

class WatchlistService {
  /**
   * Get all watchlisted movie IDs
   */
  getWatchlistIds() {
    try {
      const raw = localStorage.getItem(WATCHLIST_KEY)
      return raw ? JSON.parse(raw) : ['mm-1', 'mm-2'] // Initial seed for realism
    } catch {
      return ['mm-1', 'mm-2']
    }
  }

  /**
   * Check if a movie is watchlisted
   */
  isWatchlisted(movieId) {
    const ids = this.getWatchlistIds()
    return ids.some((id) => String(id) === String(movieId))
  }

  /**
   * Toggle movie in or out of watchlist
   */
  toggleWatchlist(movieId) {
    try {
      const ids = this.getWatchlistIds()
      const index = ids.findIndex((id) => String(id) === String(movieId))
      let added = false

      if (index === -1) {
        ids.push(movieId)
        added = true
      } else {
        ids.splice(index, 1)
        added = false
      }

      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids))
      return { success: true, isWatchlisted: added, ids }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  /**
   * Remove item from watchlist
   */
  removeFromWatchlist(movieId) {
    try {
      const ids = this.getWatchlistIds().filter((id) => String(id) !== String(movieId))
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids))
      return { success: true, ids }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }
}

export default new WatchlistService()

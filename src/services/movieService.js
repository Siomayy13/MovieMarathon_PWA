import { apiClient, IS_SUPABASE, BASE_URL } from '../config/api'
import { DEFAULT_MOVIES } from '../data/movies'

const LOCAL_STORAGE_KEY = 'movie_marathon_database_v1'

// ---------------------------------------------------------------------------
// Helpers for Local Storage Persistence (Offline CRUD)
// ---------------------------------------------------------------------------
const getStoredMovies = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_MOVIES))
      return DEFAULT_MOVIES
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MOVIES
  } catch {
    return DEFAULT_MOVIES
  }
}

const saveStoredMovies = (list) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.warn('LocalStorage save failed:', e)
  }
}

// ---------------------------------------------------------------------------
// Normalizer
// ---------------------------------------------------------------------------
export const normalizeMovie = (item) => {
  if (!item) return null

  return {
    id: item.id || `mm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: item.title || item.name || 'Untitled Title',
    name: item.title || item.name || 'Untitled Title',
    type: item.type || (item.category === 'minuman' ? 'K-Drama' : 'Movie'),
    category: item.type || item.category || 'Movie',
    genre: item.genre || 'Drama',
    release_year: Number(item.release_year || item.year || 2024),
    year: Number(item.release_year || item.year || 2024),
    duration: item.duration || '120 mins',
    rating: Number(item.rating ?? 8.5),
    director: item.director || 'Director unknown',
    cast: item.cast || 'Various artists',
    streaming_on: item.streaming_on || 'Netflix / Cinema',
    description: item.description || item.synopsis || '',
    synopsis: item.description || item.synopsis || '',
    image_url:
      item.image_url ||
      item.image ||
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    tags: Array.isArray(item.tags)
      ? item.tags
      : (item.ingredients ? item.ingredients.map((i) => i.name || i) : ['Trending']),
    featured: Boolean(item.featured || item.is_featured),
    created_at: item.created_at || new Date().toISOString(),
  }
}

class MovieService {
  /**
   * Fetch movies with search, filter, and sorting support.
   */
  async getMovies(params = {}) {
    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          const queryParts = ['select=*']
          if (params.search) {
            queryParts.push(`title=ilike.*${encodeURIComponent(params.search)}*`)
          }
          if (params.category && params.category !== 'All') {
            queryParts.push(`type=eq.${encodeURIComponent(params.category)}`)
          }
          queryParts.push('order=created_at.desc')

          const apiData = await apiClient.get(`/rest/v1/movies?${queryParts.join('&')}`)
          if (Array.isArray(apiData) && apiData.length > 0) {
            const normalized = apiData.map(normalizeMovie)
            return { success: true, data: normalized, source: 'supabase' }
          }
        } else {
          const res = await apiClient.get('/api/v1/recipes', { params })
          if (res && (res.data || Array.isArray(res))) {
            const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : [])
            if (list.length > 0) {
              return { success: true, data: list.map(normalizeMovie), source: 'api' }
            }
          }
        }
      } catch (err) {
        console.info('[MovieService] Backend offline, menggunakan database lokal:', err.message)
      }
    }

    // Local Storage Offline Source
    const localList = getStoredMovies().map(normalizeMovie)
    return {
      success: true,
      data: localList,
      source: 'local',
      pagination: {
        total: localList.length,
        page: params.page || 1,
        limit: params.limit || 50,
      },
    }
  }

  /**
   * Fetch single movie by ID
   */
  async getMovieById(id) {
    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          const res = await apiClient.get(`/rest/v1/movies?id=eq.${id}&select=*`)
          if (Array.isArray(res) && res.length > 0) {
            return { success: true, data: normalizeMovie(res[0]) }
          }
        } else {
          const res = await apiClient.get(`/api/v1/recipes/${id}`)
          if (res && res.data) return { success: true, data: normalizeMovie(res.data) }
        }
      } catch {
        // fallback
      }
    }

    const localList = getStoredMovies()
    const found = localList.find((m) => String(m.id) === String(id))
    if (found) {
      return { success: true, data: normalizeMovie(found) }
    }
    throw new Error('Film atau drama tidak ditemukan.')
  }

  /**
   * Create movie (CRUD: Create)
   */
  async createMovie(data) {
    const localList = getStoredMovies()
    const newId = `mm-${Date.now()}`
    const normalized = normalizeMovie({
      ...data,
      id: newId,
      created_at: new Date().toISOString(),
    })

    // Store in local storage
    localList.unshift(normalized)
    saveStoredMovies(localList)

    // Sync to Supabase or API
    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          const payload = {
            title: normalized.title,
            type: normalized.type,
            genre: normalized.genre,
            release_year: normalized.release_year,
            duration: normalized.duration,
            rating: normalized.rating,
            director: normalized.director,
            cast: normalized.cast,
            streaming_on: normalized.streaming_on,
            description: normalized.description,
            image_url: normalized.image_url,
            tags: normalized.tags,
          }
          const res = await apiClient.post('/rest/v1/movies', payload, {
            headers: { Prefer: 'return=representation' },
          })
          const created = Array.isArray(res) ? res[0] : res
          return { success: true, data: normalizeMovie(created) }
        } else {
          await apiClient.post('/api/v1/recipes', {
            name: normalized.title,
            category: normalized.type === 'K-Drama' ? 'minuman' : 'makanan',
            cook_time: Math.round(normalized.rating * 10),
            description: normalized.description,
            image_url: normalized.image_url,
            ingredients: normalized.tags.map((t) => ({ name: t, quantity: 'Tag' })),
            steps: [normalized.cast, normalized.director],
          })
        }
      } catch (e) {
        console.info('Supabase/API sync skipped, data tersimpan offline:', e.message)
      }
    }

    return { success: true, data: normalized }
  }

  /**
   * Update existing movie (CRUD: Update)
   */
  async updateMovie(id, data) {
    const localList = getStoredMovies()
    const index = localList.findIndex((m) => String(m.id) === String(id))

    if (index === -1) {
      throw new Error('Data film/drama yang ingin diubah tidak ditemukan.')
    }

    const updated = normalizeMovie({
      ...localList[index],
      ...data,
      id,
      updated_at: new Date().toISOString(),
    })

    localList[index] = updated
    saveStoredMovies(localList)

    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          const payload = {
            title: data.title,
            type: data.type,
            genre: data.genre,
            release_year: data.release_year,
            duration: data.duration,
            rating: data.rating,
            director: data.director,
            cast: data.cast,
            streaming_on: data.streaming_on,
            description: data.description,
            image_url: data.image_url,
            tags: data.tags,
            updated_at: new Date().toISOString(),
          }
          await apiClient.patch(`/rest/v1/movies?id=eq.${id}`, payload, {
            headers: { Prefer: 'return=representation' },
          })
        } else {
          await apiClient.put(`/api/v1/recipes/${id}`, {
            name: updated.title,
            description: updated.description,
            image_url: updated.image_url,
          })
        }
      } catch {
        // ignore offline error
      }
    }

    return { success: true, data: updated }
  }

  /**
   * Delete movie (CRUD: Delete)
   */
  async deleteMovie(id) {
    const localList = getStoredMovies()
    const updated = localList.filter((m) => String(m.id) !== String(id))
    saveStoredMovies(updated)

    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          await apiClient.delete(`/rest/v1/movies?id=eq.${id}`)
        } else {
          await apiClient.delete(`/api/v1/recipes/${id}`)
        }
      } catch {
        // ignore
      }
    }

    return { success: true, id }
  }

  /**
   * Reset database back to default seed data
   */
  resetToDefaults() {
    saveStoredMovies(DEFAULT_MOVIES)
    return DEFAULT_MOVIES
  }
}

export default new MovieService()

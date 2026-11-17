const REVIEWS_STORAGE_KEY = 'movie_marathon_reviews'

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    movie_id: 'mm-1',
    user_name: 'MarathonLover',
    rating: 5,
    comment: 'Chemistry Kim Soo-hyun dan Kim Ji-won luar biasa! Plot twist dan emosi di setiap episode sangat menyentuh.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'rev-2',
    movie_id: 'mm-2',
    user_name: 'Cinephile99',
    rating: 5,
    comment: 'Karya legendaris Nolan. Musik Hans Zimmer saat adegan docking membuat jantung berdebar kencang.',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'rev-3',
    movie_id: 'mm-3',
    user_name: 'K-Addict',
    rating: 5,
    comment: 'Drama K-Drama terbaik sepanjang masa. Selalu menangis di episode perbatasan.',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
]

const getStoredReviews = () => {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(DEFAULT_REVIEWS))
      return DEFAULT_REVIEWS
    }
    return JSON.parse(raw)
  } catch {
    return DEFAULT_REVIEWS
  }
}

class ReviewService {
  async getReviews(movieId) {
    const all = getStoredReviews()
    const filtered = all.filter((r) => String(r.movie_id) === String(movieId))
    return { success: true, data: filtered }
  }

  async createReview(movieId, reviewData) {
    const all = getStoredReviews()
    const newReview = {
      id: `rev-${Date.now()}`,
      movie_id: String(movieId),
      user_name: reviewData.user_name || 'Anonymous Viewer',
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment || '',
      created_at: new Date().toISOString(),
    }
    all.unshift(newReview)
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(all))
    } catch {
      // ignore
    }
    return { success: true, data: newReview }
  }
}

export default new ReviewService()

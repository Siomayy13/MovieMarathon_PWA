import { Star, Edit2, Trash2 } from 'lucide-react'
import WatchlistButton from '../common/WatchlistButton'
import { formatRating, truncate } from '../../utils/helpers'

export default function MovieCard({ movie, onSelect, onEdit, onDelete }) {
  const poster =
    movie.image_url ||
    movie.image ||
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'

  return (
    <li className="movie-card">
      <div
        className="movie-card__clickable"
        onClick={() => onSelect(movie)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSelect(movie)
        }}
      >
        {/* Poster with overlay badges */}
        <div className="movie-card__poster-wrap">
          <img
            src={poster}
            alt={movie.title}
            className="movie-card__poster"
            loading="lazy"
          />
          <div className="movie-card__badge-type">{movie.type || 'Movie'}</div>
          <div className="movie-card__rating-badge">
            <Star size={13} fill="#e5a93c" stroke="#e5a93c" />
            <span>{formatRating(movie.rating)}</span>
          </div>
        </div>

        {/* Info */}
        <div className="movie-card__info">
          <h3 className="movie-card__title">{movie.title}</h3>
          <div className="movie-card__meta">
            <span>{movie.release_year || movie.year || '2024'}</span>
            <span>•</span>
            <span>{movie.duration || 'Feature'}</span>
          </div>
          <p className="movie-card__genre">{movie.genre || 'Drama'}</p>
          {movie.description && (
            <p className="movie-card__desc">{truncate(movie.description, 80)}</p>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="movie-card__actions">
        <WatchlistButton movieId={movie.id} />
        {onEdit && (
          <button
            type="button"
            className="movie-card__act-btn"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(movie)
            }}
            title="Edit Film/Drama"
            aria-label={`Edit ${movie.title}`}
          >
            <Edit2 size={14} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="movie-card__act-btn movie-card__act-btn--danger"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(movie)
            }}
            title="Hapus Film/Drama"
            aria-label={`Hapus ${movie.title}`}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </li>
  )
}

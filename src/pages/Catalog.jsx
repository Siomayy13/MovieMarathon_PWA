import { useState, useMemo } from 'react'
import { Plus, RefreshCw, Loader, AlertCircle, Film, Sparkles } from 'lucide-react'
import { useMovies } from '../hooks/useMovies'
import MovieCard from '../components/movie/MovieCard'
import MovieDetail from '../components/movie/MovieDetail'
import AdvancedFilter from '../components/common/AdvancedFilter'
import ConfirmModal from '../components/modals/ConfirmModal'
import movieService from '../services/movieService'
import {
  matchesSearch,
  matchesCategory,
  sortMovies,
  extractCategories,
} from '../utils/helpers'

export default function Catalog({ onNavigate }) {
  const { movies, loading, error, refetch, source } = useMovies()

  // Filter & Search states
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortKey, setSortKey] = useState('rating')
  const [sortOrder, setSortOrder] = useState('desc')

  // Selected for detail view
  const [selectedMovie, setSelectedMovie] = useState(null)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const categories = useMemo(() => extractCategories(movies), [movies])

  const filteredMovies = useMemo(() => {
    const list = movies.filter(
      (m) => matchesSearch(m, search) && matchesCategory(m, activeCategory),
    )
    return sortMovies(list, sortKey, sortOrder)
  }, [movies, search, activeCategory, sortKey, sortOrder])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      setDeleteError('')
      await movieService.deleteMovie(deleteTarget.id)
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      setDeleteError(err.message || 'Gagal menghapus film.')
    } finally {
      setDeleting(false)
    }
  }

  // If in detail mode
  if (selectedMovie) {
    return (
      <MovieDetail
        movie={selectedMovie}
        onBack={() => setSelectedMovie(null)}
        onEdit={(m) => onNavigate && onNavigate('Edit', m)}
        onDelete={(m) => {
          setSelectedMovie(null)
          setDeleteTarget(m)
        }}
      />
    )
  }

  return (
    <div className="catalog-page">
      {/* Masthead Banner */}
      <section className="catalog-masthead">
        <div className="masthead-content">
          <div className="masthead-badge">
            <Sparkles size={14} color="#e5a93c" />
            <span>Koleksi Terkurasi &bull; Drama &amp; Film</span>
          </div>
          <h1 className="masthead-title">Database Movie Marathon</h1>
          <p className="masthead-desc">
            Temukan daftar drama Korea, film blockbuster, dan serial terbaik untuk sesi
            binge-watching Anda. Tambahkan judul favorit, edit informasi, dan simpan ke watchlist
            bahkan saat offline.
          </p>
        </div>
      </section>

      {/* List Header & Add CTA */}
      <div className="list-toolbar">
        <div className="list-toolbar__info">
          <h2 className="section-heading">Katalog Film &amp; Drama</h2>
          <span className="count-badge">
            {filteredMovies.length} Judul Tersedia
          </span>
        </div>

        {onNavigate && (
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => onNavigate('Create')}
          >
            <Plus size={16} /> Tambah Judul Baru
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      <AdvancedFilter
        search={search}
        onSearch={setSearch}
        categories={categories}
        activeCategory={activeCategory}
        onCategory={setActiveCategory}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={({ key, order }) => {
          setSortKey(key)
          setSortOrder(order)
        }}
      />

      {/* Loading state */}
      {loading && (
        <div className="status-state">
          <Loader size={32} className="spin" />
          <p>Memuat database film dan drama...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && movies.length === 0 && (
        <div className="status-state status-state--error">
          <AlertCircle size={32} />
          <p>{error}</p>
          <button type="button" className="btn btn--outline" onClick={refetch}>
            <RefreshCw size={15} /> Muat Ulang
          </button>
        </div>
      )}

      {/* Empty Search Result */}
      {!loading && filteredMovies.length === 0 && !error && (
        <div className="status-state">
          <Film size={36} color="#495a74" />
          <h3>Tidak ada film yang cocok</h3>
          <p>Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.</p>
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => {
              setSearch('')
              setActiveCategory('All')
            }}
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Movies Grid */}
      {filteredMovies.length > 0 && (
        <ul className="movies-grid">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={setSelectedMovie}
              onEdit={onNavigate ? (m) => onNavigate('Edit', m) : undefined}
              onDelete={setDeleteTarget}
            />
          ))}
        </ul>
      )}

      {source === 'local' && (
        <p className="offline-sync-notice">
          Database tersimpan di penyimpanan offline browser (localStorage). Data aman dan dapat
          dikelola tanpa koneksi internet.
        </p>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Film / Drama?"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.title}" dari database? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteTarget(null)
          setDeleteError('')
        }}
      />

      {deleteError && <div className="toast-bar toast-bar--error">{deleteError}</div>}
    </div>
  )
}

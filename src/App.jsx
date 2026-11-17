import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Catalog from './pages/Catalog'
import WatchlistPage from './pages/WatchlistPage'
import ProfilePage from './pages/ProfilePage'
import TipsPage from './pages/TipsPage'
import CreateMoviePage from './pages/CreateMoviePage'
import EditMoviePage from './pages/EditMoviePage'
import MovieDetail from './components/movie/MovieDetail'
import SplashScreen from './components/common/SplashScreen'
import PWABadge from './components/PWABadge'
import ConfirmModal from './components/modals/ConfirmModal'
import movieService from './services/movieService'
import './App.css'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState('Catalog')
  const [mode, setMode] = useState('list') // 'list' | 'create' | 'edit' | 'detail'
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [editingMovie, setEditingMovie] = useState(null)

  // Global Delete Target
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Ensure document title and meta are always synced to Movie Marathon
  useEffect(() => {
    document.title = 'Movie Marathon — Database Drama & Movie'
  }, [])

  // Navigation controller
  const handleNavigate = (destination, payload) => {
    if (destination === 'Create') {
      setMode('create')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (destination === 'Edit') {
      setEditingMovie(payload)
      setMode('edit')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (destination === 'Detail') {
      setSelectedMovie(payload)
      setMode('detail')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Tab change
      setActiveTab(destination)
      setMode('list')
      setSelectedMovie(null)
      setEditingMovie(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBackToList = () => {
    setMode('list')
    setSelectedMovie(null)
    setEditingMovie(null)
  }

  const handleGlobalDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await movieService.deleteMovie(deleteTarget.id)
      setDeleteTarget(null)
      handleBackToList()
      setActiveTab('Catalog')
    } catch (err) {
      alert(err.message || 'Gagal menghapus data.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="shell">
      {/* Intro Splash Animation */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Persistent Navigation Header */}
      <Header
        activeTab={mode === 'list' ? activeTab : ''}
        onTabChange={(tab) => handleNavigate(tab)}
        onNavigateCreate={() => handleNavigate('Create')}
      />

      {/* Main Body View */}
      <main className="main-content">
        {mode === 'create' && (
          <CreateMoviePage
            onBack={handleBackToList}
            onSuccess={() => {
              handleBackToList()
              setActiveTab('Catalog')
            }}
          />
        )}

        {mode === 'edit' && (
          <EditMoviePage
            movie={editingMovie}
            movieId={editingMovie?.id}
            onBack={handleBackToList}
            onSuccess={() => {
              handleBackToList()
              setActiveTab('Catalog')
            }}
          />
        )}

        {mode === 'detail' && selectedMovie && (
          <MovieDetail
            movie={selectedMovie}
            onBack={handleBackToList}
            onEdit={(m) => handleNavigate('Edit', m)}
            onDelete={(m) => setDeleteTarget(m)}
          />
        )}

        {mode === 'list' && (
          <>
            {activeTab === 'Catalog' && (
              <Catalog
                onNavigate={(destination, payload) => handleNavigate(destination, payload)}
              />
            )}

            {activeTab === 'Watchlist' && (
              <WatchlistPage
                onSelectMovie={(m) => handleNavigate('Detail', m)}
                onNavigateCatalog={() => setActiveTab('Catalog')}
              />
            )}

            {activeTab === 'Profile' && (
              <ProfilePage onReplaySplash={() => setShowSplash(true)} />
            )}

            {activeTab === 'Tips' && <TipsPage />}
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus film/drama "${deleteTarget?.title}"?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        danger
        loading={deleting}
        onConfirm={handleGlobalDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* PWA Offline and Install Prompt */}
      <PWABadge />

      {/* App Footer */}
      <Footer />
    </div>
  )
}

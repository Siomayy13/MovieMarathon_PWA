import { Plus, Film, Bookmark, User, Compass } from 'lucide-react'
import { useWatchlist } from '../hooks/useWatchlist'

const NAV_ITEMS = [
  { id: 'Catalog', label: 'Database', icon: Film },
  { id: 'Watchlist', label: 'Watchlist', icon: Bookmark, hasBadge: true },
  { id: 'Profile', label: 'Profil Saya', icon: User },
  { id: 'Tips', label: 'Panduan Marathon', icon: Compass },
]

export default function Header({ activeTab, onTabChange, onNavigateCreate }) {
  const { watchlistCount } = useWatchlist()

  return (
    <header className="header">
      {/* Brand logo & title */}
      <div
        className="header-brand"
        onClick={() => onTabChange('Catalog')}
        role="button"
        tabIndex={0}
      >
        <div className="header-logo-badge">
          <Film size={20} color="#e5a93c" />
        </div>
        <div className="header-brand-text">
          <span className="brand-name">MOVIE MARATHON</span>
          <span className="brand-sub">DATABASE DRAMA &amp; MOVIE</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="header-nav" aria-label="Main Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-btn ${isActive ? 'nav-btn--active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.hasBadge && watchlistCount > 0 && (
                <span className="nav-badge">{watchlistCount}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Action CTA */}
      <div className="header-cta-wrap">
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={onNavigateCreate}
          title="Tambah Judul Baru ke Database"
        >
          <Plus size={16} />
          <span>Tambah Film</span>
        </button>
      </div>
    </header>
  )
}

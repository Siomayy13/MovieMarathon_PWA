import { useState } from 'react'
import {
  User,
  CreditCard,
  Users,
  Bookmark,
  Film,
  Camera,
  Save,
  Check,
  Play,
  Award,
  Sparkles,
} from 'lucide-react'
import userService from '../services/userService'
import { useWatchlist } from '../hooks/useWatchlist'
import { useMovies } from '../hooks/useMovies'

export default function ProfilePage({ onReplaySplash }) {
  const [profile, setProfile] = useState(() => userService.getUserProfile())

  // Form states for Nama, NIM, Kelompok
  const [nama, setNama] = useState(profile.nama || 'May Triastuti')
  const [nim, setNim] = useState(profile.nim || '21120124130088')
  const [kelompok, setKelompok] = useState(profile.kelompok || 'Kelompok 24')
  const [favoriteGenre, setFavoriteGenre] = useState(profile.favoriteGenre || 'K-Drama & Sci-Fi')
  const [bio, setBio] = useState(profile.bio || '')
  const [avatar, setAvatar] = useState(profile.avatar || null)

  const [feedback, setFeedback] = useState('')

  const { watchlistCount } = useWatchlist()
  const { movies } = useMovies()

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setFeedback('Ukuran avatar maksimal 2MB.')
      setTimeout(() => setFeedback(''), 3000)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target.result
      setAvatar(base64)
      setFeedback('Foto profil diperbarui!')
      setTimeout(() => setFeedback(''), 3000)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const updated = {
      ...profile,
      nama: nama.trim() || 'May Triastuti',
      nim: nim.trim() || '21120124130088',
      kelompok: kelompok.trim() || 'Kelompok 24',
      favoriteGenre: favoriteGenre.trim(),
      bio: bio.trim(),
      avatar,
    }

    const res = userService.saveUserProfile(updated)
    if (res.success) {
      setProfile(res.data)
      setFeedback('Data profil berhasil disimpan!')
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  return (
    <div className="profile-page">
      {/* Header section */}
      <section className="catalog-masthead" style={{ paddingBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div className="masthead-content">
            <div className="masthead-badge">
              <User size={14} color="#e5a93c" />
              <span>Profil Pengembang &bull; Praktikum PPB</span>
            </div>
            <h1 className="masthead-title">Profil Mahasiswa</h1>
            <p className="masthead-desc">
              Identitas pengembang aplikasi Progressive Web App (PWA) Movie Marathon.
            </p>
          </div>

          {onReplaySplash && (
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={onReplaySplash}
              title="Putar ulang animasi intro splash"
            >
              <Play size={15} /> Putar Ulang Intro
            </button>
          )}
        </div>
      </section>

      {feedback && (
        <div className="toast-bar toast-bar--success">
          <Check size={18} /> {feedback}
        </div>
      )}

      {/* Main Student Card */}
      <div className="student-profile-card">
        <div className="student-card__top">
          <div className="student-avatar-wrap">
            {avatar ? (
              <img src={avatar} alt={profile.nama} className="student-avatar-img" />
            ) : (
              <div className="student-avatar-placeholder">
                <User size={40} color="#e5a93c" />
              </div>
            )}
            <label htmlFor="avatar-input" className="student-avatar-edit-btn" title="Ganti Foto">
              <Camera size={14} />
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden-input"
              />
            </label>
          </div>

          <div className="student-main-info">
            <div className="badge-identity">
              <Sparkles size={13} color="#e5a93c" />
              <span>Praktikan PWA Modul VI</span>
            </div>
            <h2 className="student-name">{profile.nama}</h2>

            <div className="student-tags">
              <span className="student-tag">
                <CreditCard size={14} color="#e5a93c" />
                <strong>NIM:</strong> {profile.nim}
              </span>
              <span className="student-tag">
                <Users size={14} color="#e5a93c" />
                <strong>Kelompok:</strong> {profile.kelompok}
              </span>
            </div>

            {profile.bio && <p className="student-bio">"{profile.bio}"</p>}
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="student-stats-grid">
          <div className="student-stat-item">
            <Film size={22} color="#e5a93c" />
            <div className="student-stat-val">{movies.length}</div>
            <div className="student-stat-label">Total Judul Database</div>
          </div>
          <div className="student-stat-item">
            <Bookmark size={22} color="#e5a93c" />
            <div className="student-stat-val">{watchlistCount}</div>
            <div className="student-stat-label">Watchlist Tersimpan</div>
          </div>
          <div className="student-stat-item">
            <Award size={22} color="#27ae60" />
            <div className="student-stat-val">100%</div>
            <div className="student-stat-label">PWA Offline Ready</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="form-card" style={{ marginTop: '24px' }}>
        <h2 className="form-card__title">Perbarui Data Mahasiswa</h2>
        <p className="form-card__desc">
          Sesuaikan Nama, NIM, dan Kelompok praktikum Anda. Data akan disimpan secara lokal di
          browser (localStorage).
        </p>

        <form onSubmit={handleSaveProfile} className="student-form">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="student-nama" className="form-label">
                Nama Lengkap Mahasiswa <span className="req">*</span>
              </label>
              <input
                id="student-nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="misal: May Triastuti"
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="student-nim" className="form-label">
                Nomor Induk Mahasiswa (NIM) <span className="req">*</span>
              </label>
              <input
                id="student-nim"
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="misal: 21120124130088"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="student-kelompok" className="form-label">
                Kelompok Praktikum <span className="req">*</span>
              </label>
              <input
                id="student-kelompok"
                type="text"
                value={kelompok}
                onChange={(e) => setKelompok(e.target.value)}
                placeholder="misal: Kelompok 24"
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="student-fav" className="form-label">
                Genre Favorit
              </label>
              <input
                id="student-fav"
                type="text"
                value={favoriteGenre}
                onChange={(e) => setFavoriteGenre(e.target.value)}
                placeholder="misal: K-Drama, Romance, Sci-Fi"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="student-bio" className="form-label">
              Catatan Bio Pengembang
            </label>
            <textarea
              id="student-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Deskripsi singkat ketertarikan Anda pada film/drama dan PWA..."
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="btn btn--primary">
              <Save size={16} /> Simpan Data Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

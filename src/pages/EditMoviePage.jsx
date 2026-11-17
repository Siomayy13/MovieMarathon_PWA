import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Upload,
  Loader,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import movieService from '../services/movieService'
import uploadService from '../services/uploadService'
import {
  saveDraft,
  loadDraft,
  deleteDraft,
  hasDraft,
  getDraftTimestamp,
  formatDraftTime,
} from '../utils/draftStorage'
import ConfirmModal from '../components/modals/ConfirmModal'

export default function EditMoviePage({ movie, movieId, onBack, onSuccess }) {
  const targetId = movieId || movie?.id

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    type: 'Movie',
    genre: '',
    release_year: 2024,
    duration: '',
    rating: 8.5,
    director: '',
    cast: '',
    streaming_on: '',
    description: '',
    tags: '',
  })

  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  // Draft modal
  const [showDraftModal, setShowDraftModal] = useState(() =>
    targetId ? hasDraft(`edit_${targetId}`) : false,
  )
  const [draftTimestamp, setDraftTimestamp] = useState(() =>
    targetId ? getDraftTimestamp(`edit_${targetId}`) : null,
  )

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        setError('')
        let data = movie
        if (!data) {
          const res = await movieService.getMovieById(targetId)
          if (res.success && res.data) {
            data = res.data
          }
        }
        if (data) {
          setFormData({
            title: data.title || data.name || '',
            type: data.type || 'Movie',
            genre: data.genre || '',
            release_year: data.release_year || data.year || 2024,
            duration: data.duration || '',
            rating: data.rating || 8.5,
            director: data.director || '',
            cast: data.cast || '',
            streaming_on: data.streaming_on || '',
            description: data.description || data.synopsis || '',
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          })
          setImagePreview(data.image_url || data.image || '')
        } else {
          setError('Data film tidak ditemukan.')
        }
      } catch (err) {
        setError(err.message || 'Gagal mengambil data film.')
      } finally {
        setLoading(false)
      }
    }

    if (targetId) {
      fetchMovie()
    }
  }, [targetId, movie])

  const handleManualSaveDraft = () => {
    const draftData = { formData, imagePreview }
    const saved = saveDraft(draftData, `edit_${targetId}`)
    if (saved) {
      const ts = getDraftTimestamp(`edit_${targetId}`)
      setDraftTimestamp(ts)
      setSuccessMsg(`Perubahan tersimpan dalam draf (${formatDraftTime(ts)})`)
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleLoadDraft = () => {
    const draft = loadDraft(`edit_${targetId}`)
    if (draft) {
      if (draft.formData) setFormData(draft.formData)
      if (draft.imagePreview) setImagePreview(draft.imagePreview)
      setShowDraftModal(false)
      setSuccessMsg('Draf perubahan dipulihkan.')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleDiscardDraft = () => {
    deleteDraft(`edit_${targetId}`)
    setShowDraftModal(false)
    setDraftTimestamp(null)
  }

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      setUploading(true)
      const res = await uploadService.uploadImage(file)
      setImagePreview(res.data.url)
      setSuccessMsg('Poster diperbarui!')
      setTimeout(() => setSuccessMsg(''), 2500)
    } catch (err) {
      setError(err.message || 'Gagal memproses gambar.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Judul film wajib diisi.')
      return
    }

    const cleanTags = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    const payload = {
      title: formData.title.trim(),
      name: formData.title.trim(),
      type: formData.type,
      category: formData.type,
      genre: formData.genre.trim(),
      release_year: Number(formData.release_year) || 2024,
      year: Number(formData.release_year) || 2024,
      duration: formData.duration.trim(),
      rating: Number(formData.rating) || 8.0,
      director: formData.director.trim(),
      cast: formData.cast.trim(),
      streaming_on: formData.streaming_on.trim(),
      description: formData.description.trim(),
      synopsis: formData.description.trim(),
      image_url: imagePreview,
      tags: cleanTags,
    }

    try {
      setUpdating(true)
      const res = await movieService.updateMovie(targetId, payload)
      if (res.success) {
        deleteDraft(`edit_${targetId}`)
        if (onSuccess) onSuccess(res.data)
        else if (onBack) onBack()
      } else {
        throw new Error('Gagal memperbarui data film.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memperbarui.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="status-state">
        <Loader size={32} className="spin" />
        <p>Memuat data film untuk diedit...</p>
      </div>
    )
  }

  return (
    <div className="crud-page">
      <div className="crud-header">
        <button type="button" className="detail-back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Kembali
        </button>
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={handleManualSaveDraft}
        >
          <Save size={15} /> Simpan Draf
        </button>
      </div>

      <div className="crud-title-group">
        <h1 className="crud-title">Ubah Informasi Film / Drama</h1>
        <p className="crud-subtitle">
          ID Dokumen: <code className="code-badge">{targetId}</code>
        </p>
      </div>

      {error && (
        <div className="toast-bar toast-bar--error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {successMsg && (
        <div className="toast-bar toast-bar--success">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="crud-form">
        {/* Poster */}
        <div className="form-card">
          <h2 className="form-card__title">Poster Film / Drama</h2>
          <div className="poster-picker-row">
            <div className="poster-preview-box">
              <img src={imagePreview} alt="Poster" className="poster-preview-img" />
            </div>
            <div className="poster-controls">
              <label htmlFor="edit-poster-file" className="btn btn--primary btn--sm file-upload-label">
                <Upload size={16} />
                <span>{uploading ? 'Memproses...' : 'Ganti Gambar Poster'}</span>
                <input
                  id="edit-poster-file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden-input"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Core fields */}
        <div className="form-card">
          <h2 className="form-card__title">Perbarui Data</h2>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="edit-title" className="form-label">
                Judul Film / Drama <span className="req">*</span>
              </label>
              <input
                id="edit-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="edit-type" className="form-label">
                Kategori / Tipe <span className="req">*</span>
              </label>
              <select
                id="edit-type"
                name="type"
                value={formData.type}
                onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                className="form-select"
              >
                <option value="K-Drama">K-Drama (Serial Korea)</option>
                <option value="Movie">Movie (Film Layar Lebar)</option>
                <option value="Anime">Anime (Jepang)</option>
                <option value="Series">Western / International Series</option>
              </select>
            </div>
          </div>

          <div className="form-grid form-grid--3">
            <div className="form-field">
              <label htmlFor="edit-genre" className="form-label">
                Genre <span className="req">*</span>
              </label>
              <input
                id="edit-genre"
                type="text"
                name="genre"
                value={formData.genre}
                onChange={(e) => setFormData((p) => ({ ...p, genre: e.target.value }))}
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="edit-year" className="form-label">
                Tahun Rilis <span className="req">*</span>
              </label>
              <input
                id="edit-year"
                type="number"
                name="release_year"
                value={formData.release_year}
                onChange={(e) => setFormData((p) => ({ ...p, release_year: e.target.value }))}
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="edit-rating" className="form-label">
                Rating (0 - 10) <span className="req">*</span>
              </label>
              <input
                id="edit-rating"
                type="number"
                step="0.1"
                min="1"
                max="10"
                name="rating"
                value={formData.rating}
                onChange={(e) => setFormData((p) => ({ ...p, rating: e.target.value }))}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="edit-dur" className="form-label">
                Durasi / Episode
              </label>
              <input
                id="edit-dur"
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData((p) => ({ ...p, duration: e.target.value }))}
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="edit-stream" className="form-label">
                Platform Streaming
              </label>
              <input
                id="edit-stream"
                type="text"
                value={formData.streaming_on}
                onChange={(e) => setFormData((p) => ({ ...p, streaming_on: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="edit-dir" className="form-label">
                Sutradara
              </label>
              <input
                id="edit-dir"
                type="text"
                value={formData.director}
                onChange={(e) => setFormData((p) => ({ ...p, director: e.target.value }))}
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="edit-cast" className="form-label">
                Pemeran
              </label>
              <input
                id="edit-cast"
                type="text"
                value={formData.cast}
                onChange={(e) => setFormData((p) => ({ ...p, cast: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="edit-desc" className="form-label">
              Sinopsis
            </label>
            <textarea
              id="edit-desc"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              className="form-textarea"
            />
          </div>

          <div className="form-field">
            <label htmlFor="edit-tags" className="form-label">
              Tag Marathon
            </label>
            <input
              id="edit-tags"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
              className="form-input"
            />
          </div>
        </div>

        <div className="crud-actions-bar">
          <button type="button" className="btn btn--outline" onClick={onBack} disabled={updating}>
            Batal
          </button>
          <button type="submit" className="btn btn--primary" disabled={updating}>
            {updating ? (
              <>
                <Loader size={16} className="spin" /> Memperbarui...
              </>
            ) : (
              'Simpan Perubahan'
            )}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showDraftModal}
        title="Pulihkan Perubahan Belum Disimpan?"
        message={`Ditemukan draf edit tersimpan ${
          draftTimestamp ? formatDraftTime(draftTimestamp) : 'sebelumnya'
        }. Ingin memulihkan?`}
        confirmLabel="Pulihkan"
        cancelLabel="Buang"
        onConfirm={handleLoadDraft}
        onCancel={handleDiscardDraft}
      />
    </div>
  )
}

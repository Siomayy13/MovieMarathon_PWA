import { useState, useEffect } from 'react'
import { Download, WifiOff, X } from 'lucide-react'

export default function PWABadge() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    const handleAppInstalled = () => {
      setInstalled(true)
      setInstallPrompt(null)
    }

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
    }
    setInstallPrompt(null)
  }

  if (dismissed) return null

  // Offline status banner
  if (isOffline) {
    return (
      <aside className="pwa-toast pwa-toast--offline" role="status" aria-live="polite">
        <WifiOff size={18} />
        <span>Mode Offline Aktif. Database lokal Movie Marathon tetap dapat digunakan sepenuhnya.</span>
      </aside>
    )
  }

  // Install PWA banner
  if (installPrompt && !installed) {
    return (
      <aside className="pwa-toast pwa-toast--install" role="region" aria-label="Install Aplikasi">
        <div className="pwa-toast__content">
          <Download size={18} color="#e5a93c" />
          <span>
            Pasang aplikasi <strong>Movie Marathon</strong> di layar utama / desktop Anda.
          </span>
        </div>
        <div className="pwa-toast__actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={handleInstallClick}
          >
            Install Sekarang
          </button>
          <button
            type="button"
            className="pwa-toast__close"
            onClick={() => setDismissed(true)}
            aria-label="Tutup notifikasi"
          >
            <X size={16} />
          </button>
        </div>
      </aside>
    )
  }

  return null
}

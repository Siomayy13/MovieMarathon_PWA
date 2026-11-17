import { Film, Wifi, Download } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-brand">
            <Film size={18} color="#e5a93c" />
            <span>Movie Marathon PWA</span>
          </div>
          <p className="footer-desc">
            Aplikasi Progressive Web App (PWA) untuk database drama dan movie, mendukung
            penggunaan offline penuh, bookmark watchlist, dan operasi CRUD interaktif.
          </p>
        </div>

        <div className="footer-right">
          <div className="pwa-status-pills">
            <span className="footer-badge">
              <Wifi size={13} color="#27ae60" /> Offline Ready
            </span>
            <span className="footer-badge">
              <Download size={13} color="#e5a93c" /> Installable PWA
            </span>
          </div>
          <p className="footer-copy">
            Praktikum Pemrograman Perangkat Bergerak (PPB) &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}

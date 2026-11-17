import { Film, CheckCircle, Wifi, Download, Coffee, Popcorn } from 'lucide-react'

export default function TipsPage() {
  return (
    <div className="tips-page">
      <section className="catalog-masthead">
        <div className="masthead-content">
          <div className="masthead-badge">
            <Popcorn size={14} color="#e5a93c" />
            <span>Tips &amp; Panduan Marathon</span>
          </div>
          <h1 className="masthead-title">Panduan Movie Marathon</h1>
          <p className="masthead-desc">
            Panduan praktis memaksimalkan pengalaman binge-watching Anda dan memanfaatkan fitur PWA
            Movie Marathon secara optimal di perangkat mobile atau desktop.
          </p>
        </div>
      </section>

      <div className="tips-grid">
        <div className="tip-card">
          <div className="tip-card__icon">
            <Wifi size={24} color="#27ae60" />
          </div>
          <h3 className="tip-card__title">Akses PWA Sepenuhnya Offline</h3>
          <p className="tip-card__desc">
            Aplikasi ini memanfaatkan Service Worker dan Web App Manifest. Seluruh database,
            watchlist, ulasan, serta fungsi tambah dan edit (CRUD) tetap berjalan mulus meskipun
            koneksi internet Anda terputus di tengah perjalanan.
          </p>
        </div>

        <div className="tip-card">
          <div className="tip-card__icon">
            <Download size={24} color="#e5a93c" />
          </div>
          <h3 className="tip-card__title">Pasang di Smartphone / Laptop</h3>
          <p className="tip-card__desc">
            Klik tombol <strong>"Install Sekarang"</strong> pada banner yang muncul di bawah atau
            menu browser ("Add to Home Screen"). Aplikasi akan terbuka dalam mode standalone tanpa
            address bar selayaknya aplikasi native.
          </p>
        </div>

        <div className="tip-card">
          <div className="tip-card__icon">
            <Coffee size={24} color="#ff7b25" />
          </div>
          <h3 className="tip-card__title">Aturan Marathon Sehat</h3>
          <p className="tip-card__desc">
            Ambil jeda istirahat 10 menit setiap 2 episode drama (atau 1 film berdurasi panjang).
            Pastikan pencahayaan ruangan cukup dan siapkan camilan sehat serta hidrasi yang cukup.
          </p>
        </div>

        <div className="tip-card">
          <div className="tip-card__icon">
            <Film size={24} color="#3498db" />
          </div>
          <h3 className="tip-card__title">Kelola Antrean di Watchlist</h3>
          <p className="tip-card__desc">
            Gunakan fitur bookmark di setiap kartu film untuk menyimpan judul yang ingin Anda tonton
            saat akhir pekan tanpa perlu mencarinya lagi dari awal.
          </p>
        </div>
      </div>

      <div className="form-card" style={{ marginTop: '28px' }}>
        <h2 className="form-card__title">Teknologi yang Digunakan (Sesuai Modul VI)</h2>
        <ul className="tech-list">
          <li>
            <CheckCircle size={16} color="#27ae60" />
            <span><strong>React 19 &amp; Vite:</strong> Single Page Application cepat dengan modularitas komponen.</span>
          </li>
          <li>
            <CheckCircle size={16} color="#27ae60" />
            <span><strong>Vite PWA Plugin:</strong> Auto-updating Service Worker dan Web App Manifest.</span>
          </li>
          <li>
            <CheckCircle size={16} color="#27ae60" />
            <span><strong>Axios &amp; LocalStorage:</strong> Integrasi RESTful API / Supabase dengan offline data fallback.</span>
          </li>
          <li>
            <CheckCircle size={16} color="#27ae60" />
            <span><strong>Lucide React:</strong> Ikon antarmuka modern yang tajam dan responsif.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

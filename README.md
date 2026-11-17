# Movie Marathon — Progressive Web App (PWA)

Aplikasi Progressive Web App (PWA) modern untuk **Database Drama dan Movie Populer**, dilengkapi sistem Watchlist, Ulasan Komunitas, dan operasi CRUD penuh yang dapat berjalan 100% secara offline.

Aplikasi ini dikembangkan untuk memenuhi tugas praktikum **Pemrograman Perangkat Bergerak (Modul VI - Progressive Web App II)**.

---

## 🚀 Fitur Utama

1. **Multi-Page Navigation (4+ Halaman Navigasi Dinamis)**
   - **Database / Katalog**: Menjelajahi film dan drama dengan live search, filter tipe/kategori (Movie, K-Drama, Anime, Series), dan sorting (Rating, Tahun Rilis, Judul).
   - **Watchlist (Favorit)**: Daftar tontonan yang dibookmark oleh pengguna, tersimpan otomatis di browser (`localStorage`) dan siap diakses secara offline.
   - **Profil Mahasiswa**: Menampilkan identitas mahasiswa (**Nama, NIM, Kelompok**), statistik marathon, bio pengembang, ganti avatar, dan fitur putar ulang animasi intro (Splash Screen).
   - **Panduan Marathon & Tips PWA**: Berisi tips maraton sehat, panduan instalasi PWA di mobile/desktop, dan ringkasan arsitektur teknologi.
   - **Detail Film & Drama**: Halaman detail dengan sinopsis lengkap, data sutradara & aktor, platform streaming, dan formulir rating & ulasan bintang.

2. **CRUD Fungsional Penuh (Create, Read, Update, Delete)**
   - **Create**: Formulir penambahan film/drama baru dengan poster uploader (data URL base64) atau preset visual, validasi input, dan auto-save draft.
   - **Read**: Menampilkan database judul lengkap dengan pencarian real-time dan penyaringan kategori.
   - **Update**: Mengubah metadata film/drama yang sudah ada dengan fitur pemulihan draf belum tersimpan.
   - **Delete**: Menghapus data dengan dialog konfirmasi modal yang aman.
   - **Data Persistence**: Didukung `localStorage` ganda dan fallback graceful jika server API sedang tidak aktif.

3. **Fungsionalitas PWA (Installable & Offline First)**
   - **Web App Manifest**: Mengatur nama aplikasi, ikon, display `standalone`, dan warna tema sinematik `#0e131f`.
   - **Service Worker & Caching**: Menggunakan `vite-plugin-pwa` dan Workbox untuk mem-precache seluruh aset statis (`HTML`, `CSS`, `JS`, `SVG`, `PNG`) serta runtime cache gambar.
   - **PWA Installation Banner**: Prompt otomatis untuk menginstal aplikasi ke Layar Utama (Home Screen) smartphone atau aplikasi desktop.
   - **Offline Detector**: Banner deteksi otomatis saat koneksi internet terputus dengan konfirmasi bahwa database lokal tetap dapat digunakan.

4. **Desain Sinematik & Responsif**
   - Tema gelap modern dengan aksen *cinema gold/amber* (`#e5a93c`).
   - Animasi Splash Screen interaktif pembuka sesi marathon.
   - Kompatibel penuh di tampilan mobile smartphone, tablet, maupun layar desktop.

---

## 📂 Struktur Direktori Proyek

```
MovieMarathon_PWA/
├── public/
│   ├── icon-192.png              # Icon PWA 192x192
│   ├── icon-512.png              # Icon PWA 512x512
│   ├── icon.svg                  # Favicon SVG
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── movie-logo.svg        # Clapperboard Cinema Logo
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AdvancedFilter.jsx # Pencarian, filter kategori, sorting
│   │   │   ├── SplashScreen.css  # Animasi clapperboard film
│   │   │   ├── SplashScreen.jsx  # Layar intro sinematik
│   │   │   └── WatchlistButton.jsx # Bookmark watchlist
│   │   ├── modals/
│   │   │   └── ConfirmModal.jsx   # Dialog konfirmasi aksi (Delete/Draft)
│   │   ├── movie/
│   │   │   ├── MovieCard.jsx     # Kartu tampilan film
│   │   │   └── MovieDetail.jsx   # Detail film, sinopsis, & ulasan
│   │   ├── Footer.jsx            # Identitas praktikum & footer
│   │   ├── Header.jsx            # Brand header & navigasi tab
│   │   └── PWABadge.jsx          # Banner instalasi PWA & status offline
│   ├── config/
│   │   └── api.js                # Konfigurasi Axios & API / Supabase
│   ├── data/
│   │   └── movies.js             # Seed database awal (K-Drama & Movie)
│   ├── hooks/
│   │   ├── useMovies.js          # Hook state data film & pagination
│   │   ├── useReviews.js         # Hook submit & fetch review
│   │   └── useWatchlist.js       # Hook manajemen bookmark watchlist
│   ├── pages/
│   │   ├── Catalog.jsx           # Halaman utama katalog & CRUD list
│   │   ├── CreateMoviePage.jsx   # Halaman Tambah Judul (Create)
│   │   ├── EditMoviePage.jsx     # Halaman Ubah Data (Update)
│   │   ├── ProfilePage.jsx       # Halaman Profil Mahasiswa (Nama, NIM, Kelompok)
│   │   ├── TipsPage.jsx          # Halaman Panduan & Tips Marathon
│   │   └── WatchlistPage.jsx     # Halaman Daftar Tontonan Disimpan
│   ├── services/
│   │   ├── movieService.js       # Layanan CRUD data film & local persistence
│   │   ├── reviewService.js      # Layanan ulasan & rating
│   │   ├── uploadService.js      # Layanan konversi/unggah poster
│   │   ├── userService.js        # Layanan simpan identitas Nama, NIM, Kelompok
│   │   └── watchlistService.js   # Layanan toggle watchlist
│   ├── utils/
│   │   ├── draftStorage.js       # Auto-save draf formulir di browser
│   │   └── helpers.js            # Format rating, sort, filter & search
│   ├── App.css                   # Desain gaya sinematik & responsif
│   ├── App.jsx                   # Root component & orchestrator halaman
│   ├── index.css                 # CSS variables & typography
│   └── main.jsx                  # React entry point
├── .env                          # Konfigurasi environment
├── .env.example
├── .gitignore
├── index.html                    # HTML root & meta PWA
├── package.json                  # Dependencies & scripts
├── vercel.json                   # Konfigurasi SPA routing di Vercel
└── vite.config.js                # Konfigurasi Vite & VitePWA plugin
```

---

## 🛠️ Cara Menjalankan Secara Lokal

1. **Buka terminal dan masuk ke direktori proyek**:
   ```bash
   cd "c:\Users\ASUS TUF GAMING A15\Documents\PRAKTIKUM SEM 5\MovieMarathon_PWA"
   ```

2. **Jalankan server pengembangan**:
   ```bash
   npm run dev
   ```

3. Buka URL yang muncul di terminal (biasanya `http://localhost:5173`) di browser.

4. **Uji Build Produksi**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🚢 Panduan Deploy ke Vercel (Langkah demi Langkah)

Sesuai instruksi pada modul praktikum:

### Langkah 1: Inisialisasi Git Repository Lokal
Di dalam folder `MovieMarathon_PWA`:
```bash
git init
git add .
git commit -m "feat: inisialisasi Movie Marathon PWA dengan CRUD, Profile, dan Offline Support"
```

### Langkah 2: Buat Repository Baru di GitHub
1. Buka [GitHub](https://github.com/new).
2. Buat repository baru, misalnya dengan nama: `MovieMarathon_PWA` (pilih **Public**).
3. Salin tautan repository GitHub yang baru dibuat.

### Langkah 3: Push ke GitHub
Jalankan perintah berikut di terminal Anda:
```bash
git remote add origin https://github.com/[USERNAME-ANDA]/MovieMarathon_PWA.git
git branch -M main
git push -u origin main
```

### Langkah 4: Deploy di Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan login menggunakan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Cari repository `MovieMarathon_PWA` yang baru saja Anda push, lalu klik tombol **"Import"**.
4. Di bagian konfigurasi project:
   - **Framework Preset**: Vite (terdeteksi otomatis)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik tombol **"Deploy"**.
6. Tunggu sekitar 1 menit hingga proses build selesai. Vercel akan memberikan link domain publik yang aktif (misal `https://movie-marathon-pwa.vercel.app`).
7. Buka link tersebut di smartphone Anda, klik tombol share di browser dan pilih **"Add to Home Screen"** untuk menginstal aplikasi PWA Anda!

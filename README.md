# 📐 EduPredict Math — Frontend Client

> Aplikasi web adaptif untuk pembelajaran Matematika berbasis prediksi AI, dibangun dengan React + Vite.

## 📖 Deskripsi

**EduPredict Math** adalah platform edukasi yang membantu siswa meningkatkan kemampuan Matematika melalui quiz adaptif dan sistem prediksi berbasis AI. Aplikasi ini menyediakan dashboard untuk **siswa** dan **guru** dengan fitur-fitur seperti quiz interaktif, pelacakan progres, leaderboard, achievement/reward, manajemen kelas, dan notifikasi.

## 🚀 Tech Stack

| Teknologi | Versi | Keterangan |
|---|---|---|
| [React](https://react.dev/) | ^19.2.6 | UI Library |
| [Vite](https://vite.dev/) | ^8.0.12 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | ^4.3.0 | Utility-first CSS framework |
| [React Router DOM](https://reactrouter.com/) | ^7.15.1 | Client-side routing |
| [Axios](https://axios-http.com/) | ^1.16.1 | HTTP client |
| [Recharts](https://recharts.org/) | ^3.8.1 | Chart library untuk visualisasi data |
| [Lucide React](https://lucide.dev/) | ^1.17.0 | Icon library |
| [Lottie React](https://lottiereact.com/) | ^2.4.1 | Animasi Lottie |
| [Vite PWA Plugin](https://vite-pwa-org.netlify.app/) | ^1.3.0 | Progressive Web App support |

## 📁 Struktur Folder

```
client/
├── public/                  # Asset statis (favicon, ikon PWA, dll.)
├── src/
│   ├── assets/              # Gambar, Lottie JSON, dan asset lainnya
│   ├── components/          # Komponen UI yang reusable
│   │   ├── landing/         # Komponen halaman landing
│   │   ├── layout/          # Komponen layout (navbar, sidebar, dll.)
│   │   ├── shared/          # Komponen shared/umum
│   │   ├── student/         # Komponen khusus siswa
│   │   ├── teacher/         # Komponen khusus guru
│   │   └── ui/              # Komponen UI dasar (button, modal, dll.)
│   ├── constants/           # Konstanta aplikasi
│   ├── context/             # React Context (AuthContext)
│   ├── data/                # Data statis/mock
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Layout wrapper (AuthLayout, dll.)
│   ├── pages/               # Halaman-halaman aplikasi
│   │   ├── student/         # Halaman khusus siswa
│   │   └── teacher/         # Halaman khusus guru
│   ├── routes/              # Konfigurasi routing (AppRoutes)
│   ├── services/            # API service layer (Axios instance)
│   ├── styles/              # File styling & tema
│   └── utils/               # Fungsi utilitas
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point aplikasi
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── index.html               # HTML template
├── vite.config.js           # Konfigurasi Vite + PWA
├── vercel.json              # Konfigurasi deployment Vercel
├── eslint.config.js         # Konfigurasi ESLint
└── package.json
```

## ⚙️ Prasyarat

- **Node.js** >= 18.x
- **npm** >= 9.x (atau pnpm/yarn)

## 🛠️ Instalasi & Menjalankan

1. **Clone repository** dan masuk ke folder client:

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Buat file `.env`** di root folder `client/`:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Jalankan development server:**

   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:5173` (default Vite).

## 📜 Skrip yang Tersedia

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Menjalankan development server dengan HMR |
| `npm run build` | Build production ke folder `dist/` |
| `npm run preview` | Preview hasil build production |
| `npm run lint` | Menjalankan ESLint untuk pengecekan kode |

## 🗺️ Routing & Halaman

### Halaman Publik
| Path | Halaman | Deskripsi |
|---|---|---|
| `/` | Landing Page | Halaman utama / beranda |
| `/login` | Login | Halaman login |
| `/register` | Register | Halaman registrasi |
| `/forgot-password` | Forgot Password | Lupa kata sandi |
| `/reset-password/:token` | Reset Password | Reset kata sandi via token |

### Halaman Siswa (Protected — role: `student`)
| Path | Halaman | Deskripsi |
|---|---|---|
| `/student` | Dashboard | Dashboard utama siswa |
| `/student/quizzes` | Quizzes | Daftar quiz yang tersedia |
| `/student/quizzes/library` | Quiz Library | Koleksi quiz |
| `/student/quiz/play` | Quiz Play | Halaman mengerjakan quiz |
| `/student/quiz/result` | Quiz Result | Hasil quiz |
| `/student/progress` | Progress | Pelacakan progres belajar |
| `/student/rewards` | Rewards | Achievement & reward |
| `/student/profile` | Profile | Profil siswa |
| `/student/settings` | Settings | Pengaturan akun |
| `/student/notifications` | Notifications | Notifikasi |

### Halaman Guru (Protected — role: `teacher`)
| Path | Halaman | Deskripsi |
|---|---|---|
| `/teacher` | Dashboard | Dashboard utama guru |
| `/teacher/classes` | Classes | Manajemen kelas |
| `/teacher/classes/:classId` | Class Detail | Detail kelas |
| `/teacher/students` | Students | Daftar siswa |
| `/teacher/students/:studentId` | Student Detail | Detail progres siswa |
| `/teacher/profile` | Profile | Profil guru |
| `/teacher/settings` | Settings | Pengaturan akun |
| `/teacher/notifications` | Notifications | Notifikasi |

## 📱 Progressive Web App (PWA)

Aplikasi ini mendukung **PWA** dengan fitur:
- **Auto-update** service worker saat ada versi baru
- **Installable** — dapat dipasang di perangkat mobile & desktop
- **Offline caching** untuk asset statis
- Orientasi **portrait** secara default

## 🌐 Deployment

Aplikasi dikonfigurasi untuk deploy di **Vercel** dengan SPA rewrite:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Pastikan environment variable `VITE_API_URL` diset di dashboard Vercel sesuai URL backend production.

## 🔑 Environment Variables

| Variable | Deskripsi | Contoh |
|---|---|---|
| `VITE_API_URL` | Base URL API backend | `http://localhost:5000/api` |

## 📄 Lisensi

Proyek ini dibuat untuk keperluan **Coding Camp 2026**.

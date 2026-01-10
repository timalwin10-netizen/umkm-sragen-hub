# 🏪 GERAI UMKM Sragen

Platform digital untuk memajukan UMKM (Usaha Mikro, Kecil, dan Menengah) di Kabupaten Sragen, Jawa Tengah.

![Dark Theme](https://placehold.co/800x400/0a0a0f/22c55e?text=UMKM+Sragen+Hub)

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Tech Stack](#-tech-stack)
- [Instalasi](#-instalasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Project](#-struktur-project)
- [API Endpoints](#-api-endpoints)
- [ReactBits Components](#-reactbits-components)

---

## ✨ Fitur

### 👤 User Features
- **Registrasi & Login** - Autentikasi dengan JWT
- **Dashboard** - Kelola profil toko UMKM
- **Jelajahi Toko** - Cari dan filter toko UMKM
- **Berita** - Baca berita dan update UMKM
- **Tantangan** - Ikuti kompetisi dan tantangan

### 👑 Admin Features
- **Kelola Berita** - Tambah/hapus artikel berita
- **Kelola Toko** - Lihat dan hapus toko
- **Kelola Tantangan** - Buat tantangan baru

### 🎨 Design Features
- **Dark Clean Theme** - Tema gelap yang elegan
- **Aurora Background** - Animasi gradient background
- **Glass Morphism** - Efek kaca pada form
- **SpotlightCard** - Efek spotlight saat hover
- **Smooth Animations** - Animasi scroll dan transisi

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React Framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Axios** - HTTP client

### Backend
- **Express.js** - Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

---

## 📦 Instalasi

### Prerequisites
- Node.js 18+
- npm atau yarn

### Clone Repository
```bash
git clone <repository-url>
cd react
```

### Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

---

## 🚀 Menjalankan Aplikasi

### 1. Jalankan Backend
```bash
cd server
npm run dev
```
Server berjalan di: `http://localhost:5000`

> **Note:** Backend otomatis menggunakan In-Memory MongoDB jika MongoDB lokal tidak tersedia.

### 2. Jalankan Frontend
```bash
cd client
npm run dev
```
Frontend berjalan di: `http://localhost:3000`

---

## 📁 Struktur Project

```
react/
├── client/                     # Frontend (Next.js)
│   ├── src/
│   │   ├── app/               # App Router Pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── login/         # Login page
│   │   │   ├── register/      # Register page
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── toko/          # Shop listing & detail
│   │   │   ├── berita/        # News listing & detail
│   │   │   ├── tantangan/     # Challenges
│   │   │   └── admin/         # Admin panel
│   │   ├── components/        # React components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── reactbits/     # Animated components
│   │   └── utils/
│   │       └── api.ts         # Axios instance
│   └── package.json
│
├── server/                     # Backend (Express)
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Route handlers
│   ├── middleware/            # Auth middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── uploads/               # File uploads
│   ├── server.js              # Entry point
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

### Shops
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shops` | Get all shops |
| GET | `/api/shops/:id` | Get shop by ID |
| POST | `/api/shops` | Create shop (auth) |
| PUT | `/api/shops/:id` | Update shop (auth) |
| DELETE | `/api/shops/:id` | Delete shop (admin) |

### News
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news` | Get all news |
| GET | `/api/news/:id` | Get news by ID |
| POST | `/api/news` | Create news (admin) |
| DELETE | `/api/news/:id` | Delete news (admin) |

### Challenges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/challenges` | Get all challenges |
| POST | `/api/challenges` | Create challenge (admin) |
| POST | `/api/challenges/:id/join` | Join challenge (auth) |

---

## 🎨 ReactBits Components

Komponen animasi custom yang dibuat untuk project ini:

| Component | File | Description |
|-----------|------|-------------|
| `BlurText` | `BlurText.tsx` | Text reveal dengan efek blur |
| `Aurora` | `Aurora.tsx` | Animated gradient background |
| `SpotlightCard` | `SpotlightCard.tsx` | Card dengan spotlight hover |
| `MagneticButton` | `MagneticButton.tsx` | Button yang mengikuti cursor |
| `FadeIn` | `FadeIn.tsx` | Scroll-triggered fade animation |
| `TiltCard` | `TiltCard.tsx` | 3D tilt effect on hover |
| `GradientButton` | `GradientButton.tsx` | Animated gradient button |

### Usage Example
```tsx
import BlurText from '@/components/reactbits/BlurText';
import FadeIn from '@/components/reactbits/FadeIn';

export default function MyPage() {
  return (
    <FadeIn>
      <h1>
        <BlurText text="Hello World" className="text-white" />
      </h1>
    </FadeIn>
  );
}
```

---



## 🎨 Theme Colors

| Variable | Color | Usage |
|----------|-------|-------|
| `--background` | `#0a0a0f` | Page background |
| `--foreground` | `#f5f5f5` | Text color |
| `--primary` | `#22c55e` | Green accent |
| `--secondary` | `#16a34a` | Green secondary |
| `--card` | `#12121a` | Card background |
| `--border` | `#2a2a3e` | Border color |
| `--muted` | `#1a1a2e` | Muted background |

---


---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan buat Pull Request atau Issue.

---

**Made with kesabaran for UMKM Sragen**

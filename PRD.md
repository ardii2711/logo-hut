# DOKUMEN PERSYARATAN PRODUK (PRD)

**Portal Pengumpulan Sayembara Logo HUT ke-14 Mamuju Tengah**  
**Versi:** MVP 1.0 | **Status:** Final untuk Development  
**Arsitektur:** Backend (Express.js + Prisma + TypeScript) + Frontend (Next.js + TypeScript)  
**Database & Storage:** Supabase (PostgreSQL + Storage)  
**Deployment:** Backend → Render | Frontend → Vercel

---

## 1. Ringkasan & Tujuan Produk

Portal web sederhana untuk menerima pendaftaran dan karya Sayembara Logo Hari Jadi ke-14 Kabupaten Mamuju Tengah secara online. Sistem ini menggantikan penggunaan Google Form/Drive untuk memastikan keamanan dokumen KTP, privasi karya antar peserta, dan kemudahan manajemen data bagi panitia (Dinas Kominfostatisper & Disporapar Mamuju Tengah).

MVP berfokus pada alur utama: **Submit → Simpan → Kelola → Lihat/Download**.

---

## 2. Pengguna Sistem & Scope MVP

### 2.1 Peserta (Publik)

Peserta adalah masyarakat umum yang memiliki KTP Kab. Mamuju Tengah.

- Mengakses halaman form publik tanpa perlu membuat akun atau login.
- Hanya diperbolehkan mendaftarkan **1 karya logo** per peserta.
- Mendapatkan kode submission unik (contoh: `MATENG-7KQ29X`) sebagai bukti pengiriman berhasil.
- **Pembatasan:** Tidak dapat mengedit/menghapus data, melihat karya peserta lain, atau melihat status penilaian.

### 2.2 Admin (Panitia)

- Login menggunakan kredensial: `admin@gmail.com` / `Adminlogo123` via Supabase Auth.
- Mengakses `/dashboard` untuk melihat tabel daftar seluruh submission (50 item per halaman).
- Melakukan pencarian **real-time** data peserta berdasarkan Nama, Email, WhatsApp, atau Kode Submission.
- Melihat detail data peserta, preview logo, serta mengunduh file KTP dan Logo melalui _Signed URL_ yang aman.
- **Admin dapat logout** untuk mengakhiri sesi.

---

## 3. Ketentuan Pengumpulan & Validasi Formulir

Sistem memvalidasi data dan file sesuai dengan syarat dan ketentuan sayembara:

- **Data Diri:** Nama Lengkap, Nomor WhatsApp (wajib unik, dinormalisasi), dan Email (wajib unik). Constraint _unique_ pada database akan menolak pengiriman ganda dari kontak yang sama.
- **Dokumen KTP:** Peserta wajib mengunggah foto/scan KTP Kab. Mamuju Tengah (Format: JPG/PNG/PDF, Maks: 5MB). File disimpan di _Private Storage_. **KTP tidak perlu diverifikasi**, hanya disimpan untuk arsip panitia.
- **File Karya Logo:** Logo wajib diunggah dalam format **PNG** atau **JPEG** (Maks: 10MB).
- **Narasi / Filosofi Logo:** Terdapat _text area_ wajib isi untuk menjelaskan konsep, narasi, atau filosofi dari logo yang dibuat.

---

## 4. Struktur Database (Tabel Utama: `submissions`)

| Field             | Tipe        | Constraint       | Keterangan                            |
| :---------------- | :---------- | :--------------- | :------------------------------------ |
| `id`              | UUID        | PK               | Auto-generated                        |
| `submission_code` | TEXT        | UNIQUE           | Format: MATENG-XXXXXX                 |
| `name`            | TEXT        | NOT NULL         | Nama peserta                          |
| `whatsapp`        | TEXT        | UNIQUE, NOT NULL | Digunakan untuk mencegah submit ganda |
| `email`           | TEXT        | UNIQUE, NOT NULL | Digunakan untuk mencegah submit ganda |
| `ktp_file_path`   | TEXT        | NOT NULL         | Path ke Supabase Storage (Private)    |
| `logo_file_path`  | TEXT        | NOT NULL         | Path ke Supabase Storage (Private)    |
| `title`           | TEXT        | NOT NULL         | Judul karya logo                      |
| `description`     | TEXT        | NOT NULL         | Narasi & filosofi logo                |
| `created_at`      | TIMESTAMPTZ | NOT NULL         | Timestamp submit                      |

---

## 5. Persyaratan Non-Fungsional & Keamanan

- **Keamanan File:** Menggunakan Supabase Storage dengan bucket `submissions` berstatus `PRIVATE`. File KTP dan Logo tidak memiliki URL publik dan hanya dapat diakses oleh Admin yang sudah login menggunakan mekanisme _Signed URL_ (kadaluarsa 1 jam).
- **Validasi Server:** Seluruh validasi ekstensi file (khususnya PNG & JPEG untuk logo), ukuran file, dan format kontak wajib dieksekusi di sisi _server_ (Express.js Backend).
- **Ketersediaan:** Portal harus _live_ dan stabil diakses menggunakan _smartphone_ (Mobile-First UI) minimal selama masa Pendaftaran dan Pengumpulan Dokumen (29 September – 15 Oktober 2026).
- **Penanganan Error:** Pesan error _user-friendly_ dalam Bahasa Indonesia jika mendeteksi duplikasi WhatsApp/Email, file kebesaran, atau format file di luar PNG/JPEG. Kegagalan simpan database akan otomatis memicu penghapusan file _orphan_ di storage.
- **Performa Pencarian:** Search real-time dengan debounce 300ms untuk mencegah overload query.
- **Paginasi:** Admin dashboard menampilkan 50 submissions per halaman.

---

## 6. Tech Stack & Arsitektur

### 6.1 Backend (Express.js)

**Stack:**

- Runtime: Node.js 20+
- Framework: Express.js
- Bahasa: TypeScript (strict mode)
- ORM: Prisma (PostgreSQL)
- Storage: Supabase Storage
- Auth: Supabase Auth (JWT verification)
- Validasi: Zod
- Upload File: Multer (memory storage)

**Endpoint API:**

| Method | Endpoint                     | Auth      | Deskripsi                              |
| ------ | ---------------------------- | --------- | -------------------------------------- |
| POST   | `/api/submissions`           | Publik    | Submit karya (FormData)                |
| POST   | `/api/auth/login`            | Publik    | Admin login                            |
| GET    | `/api/admin/submissions`     | Protected | List submissions (paginasi, pencarian) |
| GET    | `/api/admin/submissions/:id` | Protected | Detail submission + signed URLs        |
| POST   | `/api/admin/logout`          | Protected | Logout (hapus sesi)                    |

**Struktur Proyek:**

```
be/
├── src/
│   ├── index.ts                        # Entry point Express app
│   ├── routes/
│   │   ├── submission.routes.ts
│   │   ├── admin.routes.ts
│   │   └── auth.routes.ts
│   ├── controllers/
│   │   ├── submission.controller.ts
│   │   ├── admin.controller.ts
│   │   └── auth.controller.ts
│   ├── services/
│   │   ├── storage.service.ts          # Operasi Supabase Storage
│   │   └── submission.service.ts       # Business logic
│   ├── middleware/
│   │   ├── auth.middleware.ts          # Verifikasi JWT
│   │   ├── upload.middleware.ts        # Konfigurasi Multer
│   │   └── error.middleware.ts         # Global error handler
│   ├── validations/
│   │   └── submission.schema.ts        # Schema Zod
│   ├── utils/
│   │   ├── generate-code.ts            # Generator MATENG-XXXXXX
│   │   └── normalize-phone.ts          # Normalisasi WhatsApp
│   └── types/
│       └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

**Environment Variables:**

```
DATABASE_URL=postgresql://user:pass@host:5432/db
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
PORT=5000
NODE_ENV=development
```

### 6.2 Frontend (Next.js)

**Stack:**

- Framework: Next.js 14+ (App Router)
- Bahasa: TypeScript
- Styling: Tailwind CSS
- Komponen: shadcn/ui
- Form: react-hook-form + Zod
- HTTP Client: axios
- State Management: React useState + useContext

**Halaman:**

| Route             | Akses     | Deskripsi                                |
| ----------------- | --------- | ---------------------------------------- |
| `/`               | Publik    | Form submission                          |
| `/success`        | Publik    | Halaman sukses dengan kode submission    |
| `/login`          | Publik    | Login admin                              |
| `/dashboard`      | Protected | Tabel submissions + pencarian + paginasi |
| `/dashboard/[id]` | Protected | Detail submission view                   |

**Struktur Proyek:**

```
fe/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                        # Form publik
│   ├── success/page.tsx
│   ├── login/page.tsx
│   └── dashboard/
│       ├── layout.tsx                  # Protected layout
│       ├── page.tsx                    # Tabel + pencarian + paginasi
│       └── [id]/page.tsx               # Detail view
├── components/
│   ├── ui/                             # Komponen shadcn
│   ├── forms/
│   │   └── submission-form.tsx
│   ├── admin/
│   │   ├── submissions-table.tsx
│   │   └── submission-detail.tsx
│   └── shared/
│       ├── file-upload.tsx
│       └── loading-spinner.tsx
├── lib/
│   ├── api.ts                          # Instance Axios
│   ├── auth.ts                         # Manajemen token
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   └── useDebounce.ts
└── types/
    └── index.ts
```

**Environment Variables:**

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

---

## 7. Spesifikasi API

### 7.1 POST `/api/submissions`

**Request (FormData):**

```
name: string (wajib)
email: string (wajib, format email)
whatsapp: string (wajib, akan dinormalisasi)
title: string (wajib)
description: string (wajib)
ktp_file: File (wajib, jpg/png/pdf, maks 5MB)
logo_file: File (wajib, png/jpg, maks 10MB)
```

**Response Sukses (201):**

```json
{
  "success": true,
  "data": {
    "submissionCode": "MATENG-ABC123"
  }
}
```

**Response Error (400/409):**

```json
{
  "success": false,
  "error": "Email sudah terdaftar"
}
```

### 7.2 POST `/api/auth/login`

**Request (JSON):**

```json
{
  "email": "admin@gmail.com",
  "password": "Adminlogo123"
}
```

**Response Sukses (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "admin@gmail.com"
    }
  }
}
```

### 7.3 GET `/api/admin/submissions`

**Headers:**

```
Authorization: Bearer {token}
```

**Query Params:**

```
search: string (opsional, cari nama/email/whatsapp/code)
page: number (default: 1)
limit: number (default: 50)
```

**Response Sukses (200):**

```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "submissionCode": "MATENG-ABC123",
        "name": "John Doe",
        "email": "john@example.com",
        "whatsapp": "+6281234567890",
        "title": "Logo Mamuju Tengah Modern",
        "createdAt": "2026-09-30T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    }
  }
}
```

### 7.4 GET `/api/admin/submissions/:id`

**Headers:**

```
Authorization: Bearer {token}
```

**Response Sukses (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "submissionCode": "MATENG-ABC123",
    "name": "John Doe",
    "email": "john@example.com",
    "whatsapp": "+6281234567890",
    "title": "Logo Mamuju Tengah Modern",
    "description": "Filosofi logo ini...",
    "ktpFileUrl": "https://signed-url-ktp-expires-1h",
    "logoFileUrl": "https://signed-url-logo-expires-1h",
    "createdAt": "2026-09-30T10:00:00Z"
  }
}
```

---

## 8. Schema Database (Prisma)

```prisma
model Submission {
  id              String   @id @default(uuid())
  submissionCode  String   @unique @map("submission_code")
  name            String
  whatsapp        String   @unique
  email           String   @unique
  ktpFilePath     String   @map("ktp_file_path")
  logoFilePath    String   @map("logo_file_path")
  title           String
  description     String   @db.Text
  createdAt       DateTime @default(now()) @map("created_at")

  @@map("submissions")
  @@index([email])
  @@index([whatsapp])
  @@index([submissionCode])
}
```

---

## 9. Struktur Storage (Supabase)

**Bucket:** `submissions` (PRIVATE)

**Struktur Path:**

```
submissions/
├── ktp/
│   ├── {uuid}.jpg
│   ├── {uuid}.png
│   └── {uuid}.pdf
└── logo/
    ├── {uuid}.png
    └── {uuid}.jpg
```

**RLS Policies:**

- Publik: INSERT (upload saat submission)
- Authenticated (admin): SELECT (baca untuk generate signed URL)

---

## 10. Deployment

### 10.1 Backend → Render

- Tipe Service: Web Service
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npm start`
- Environment: Set semua variabel dari `.env.example`

### 10.2 Frontend → Vercel

- Framework Preset: Next.js
- Build Command: (default)
- Environment: Set semua variabel `NEXT_PUBLIC_*`

---

## 11. Timeline

**Kritis:** Portal harus live **29 September – 15 Oktober 2026**

**Status sekarang:** 30 September 2026 (H+1, 15 hari tersisa)

**Rencana Development:**

- Backend: Hari 1-7
- Frontend: Hari 8-14
- Buffer: Hari 15

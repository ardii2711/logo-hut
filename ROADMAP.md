# ROADMAP - Portal Sayembara Logo Mamuju Tengah

**Timeline:** 15 hari tersisa (30 Sept - 15 Okt 2026)  
**Status:** H+1 dari periode pengumpulan  
**Fokus:** Backend dulu → Frontend kedua

---

## Pengembangan Backend (Hari 1-7)

### Fase BE-1: Setup Infrastructure

**Branch:** `be/setup`  
**Durasi:** Hari 1 (30 Sept)  
**Tujuan:** Skeleton proyek + database siap

**Commits:**

1. `[BE] Setup: Init Express + TypeScript + Prisma`

   - Dependensi package.json
   - tsconfig.json strict mode
   - Boilerplate Express app
   - Prisma init

2. `[BE] Setup: Schema database + migration`

   - Model Prisma schema Submission
   - Jalankan migration
   - Test koneksi

3. `[BE] Setup: Konfigurasi Supabase storage`

   - Skeleton storage service
   - Init Supabase client
   - Test upload/delete

4. `[BE] Setup: Struktur proyek + middleware`
   - Struktur folder (routes, controllers, services, middleware, utils)
   - Error middleware
   - Setup CORS
   - .env.example

**Deliverable:**

- Server berjalan di `localhost:5000`
- Database terhubung (test via Prisma Studio)
- Struktur folder lengkap

**Test:**

```bash
cd be
npm run dev
# Harus muncul: "Server running on port 5000"
```

---

### Fase BE-2: Core Services

**Branch:** `be/core-services`  
**Durasi:** Hari 2 (1 Okt)  
**Tujuan:** Services dan utilities yang reusable siap

**Commits:**

1. `[BE] Service: Storage service untuk Supabase`

   - `uploadFile(bucket, path, buffer, mimetype)`
   - `deleteFile(bucket, path)`
   - `getSignedUrl(bucket, path, expiresIn)`
   - Test fungsi secara manual

2. `[BE] Utils: Generator kode submission`

   - `generateSubmissionCode()` → MATENG-XXXXXX
   - Random alphanumeric 6 karakter
   - Test keunikan

3. `[BE] Utils: Normalisasi nomor telepon`

   - `normalizeWhatsApp(input)` → +62xxx
   - Hapus spasi, dash, titik
   - Tambah prefix +62 jika tidak ada
   - Test cases: 0812xxx, 812xxx, +62812xxx

4. `[BE] Validasi: Schema Zod`
   - SubmissionSchema (semua field)
   - LoginSchema
   - Helper validasi file

**Deliverable:**

- Semua services bisa ditest via fungsi terisolasi
- Utils bisa di-unit-test (manual)

**Test:**

```typescript
// Test di src/index.ts sementara
import { generateSubmissionCode } from "./utils/generate-code";
console.log(generateSubmissionCode()); // MATENG-A3X9K2
```

---

### Fase BE-3: Submission API

**Branch:** `be/submission-api`  
**Durasi:** Hari 3-4 (2-3 Okt)  
**Tujuan:** Endpoint submission publik berfungsi end-to-end

**Commits:**

1. `[BE] Middleware: Konfigurasi Multer upload file`

   - Accept ktp_file (jpg/png/pdf, maks 5MB)
   - Accept logo_file (png/jpg, maks 10MB)
   - Memory storage
   - Validasi mimetype

2. `[BE] Service: Business logic submission`

   - Cek duplikasi email/whatsapp
   - Upload files ke storage (ktp/, logo/)
   - Generate submission code
   - Simpan ke DB
   - Rollback storage jika DB gagal

3. `[BE] Controller: Submission controller`

   - Parse FormData
   - Validasi dengan Zod
   - Panggil service
   - Return response (201 sukses / 400 atau 409 error)

4. `[BE] Route: POST /api/submissions`
   - Wire controller
   - Wire multer middleware
   - Test dengan Thunder Client/Postman

**Deliverable:**

- POST `/api/submissions` berfungsi
- Return kode submission saat sukses
- Return error saat duplikasi/invalid

**Test:**

```bash
curl -X POST http://localhost:5000/api/submissions \
  -F "name=John Doe" \
  -F "email=john@test.com" \
  -F "whatsapp=081234567890" \
  -F "title=Logo Modern" \
  -F "description=Filosofi logo..." \
  -F "ktp_file=@path/to/ktp.jpg" \
  -F "logo_file=@path/to/logo.png"

# Expected: {"success":true,"data":{"submissionCode":"MATENG-ABC123"}}
```

**Error cases yang harus ditest:**

- Duplikasi email → 409
- Duplikasi whatsapp → 409
- File terlalu besar → 400
- Logo format PDF → 400
- Field kosong → 400

---

### Fase BE-4: Auth API

**Branch:** `be/auth-api`  
**Durasi:** Hari 5 (4 Okt)  
**Tujuan:** Login admin berfungsi + verifikasi JWT

**Commits:**

1. `[BE] Service: Integrasi Supabase Auth`

   - `login(email, password)` → panggil Supabase Auth
   - Return accessToken + user

2. `[BE] Controller: Auth controller`

   - Parse email/password
   - Validasi
   - Panggil auth service
   - Return token

3. `[BE] Route: POST /api/auth/login`

   - Wire controller
   - Test login dengan admin@gmail.com

4. `[BE] Middleware: Verifikasi JWT`
   - Ekstrak Bearer token dari headers
   - Verifikasi dengan Supabase
   - Attach user ke request
   - Return 401 jika invalid

**Deliverable:**

- POST `/api/auth/login` return token
- Auth middleware berfungsi

**Test:**

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"Adminlogo123"}'

# Expected: {"success":true,"data":{"accessToken":"eyJ...","user":{...}}}
```

---

### Fase BE-5: Admin API

**Branch:** `be/admin-api`  
**Durasi:** Hari 6 (5 Okt)  
**Tujuan:** Endpoint dashboard admin berfungsi

**Commits:**

1. `[BE] Service: Query submission admin`

   - List submissions dengan paginasi
   - Search berdasarkan name/email/whatsapp/code (case-insensitive)
   - Get submission by ID

2. `[BE] Controller: Admin controller`

   - GET `/api/admin/submissions` dengan query params
   - GET `/api/admin/submissions/:id`
   - Generate signed URLs untuk file

3. `[BE] Route: Admin routes (protected)`
   - Wire auth middleware
   - Wire controllers
   - Test dengan Bearer token

**Deliverable:**

- GET `/api/admin/submissions?search=john&page=1&limit=50` berfungsi
- GET `/api/admin/submissions/:id` return detail + signed URLs
- Metadata paginasi benar

**Test:**

```bash
TOKEN="eyJ..." # dari login

# List
curl http://localhost:5000/api/admin/submissions?page=1&limit=50 \
  -H "Authorization: Bearer $TOKEN"

# Detail
curl http://localhost:5000/api/admin/submissions/{id} \
  -H "Authorization: Bearer $TOKEN"

# Expected signed URLs kadaluarsa dalam 1 jam
```

---

### Fase BE-6: Deploy Backend

**Branch:** `be/deploy`  
**Durasi:** Hari 7 (6 Okt)  
**Tujuan:** Backend live di Render

**Commits:**

1. `[BE] Deploy: Konfigurasi Render`

   - Tambah build script
   - Tambah start script (node dist/index.js)
   - Update CORS untuk domain production

2. `[BE] Deploy: Setup Environment`

   - Dokumentasi semua env vars yang diperlukan
   - Test production DATABASE_URL

3. `[BE] Deploy: Health check endpoint`
   - GET `/health` → {status: "ok"}

**Deliverable:**

- Backend live di `https://xxx.onrender.com`
- Semua endpoint accessible
- Database terhubung
- Storage berfungsi

**Test:**

```bash
curl https://xxx.onrender.com/health
# Expected: {"status":"ok"}

# Test endpoint submission production
curl -X POST https://xxx.onrender.com/api/submissions ...
```

---

## Pengembangan Frontend (Hari 8-14)

### Fase FE-1: Setup & Layout

**Branch:** `fe/setup`  
**Durasi:** Hari 8 (7 Okt)  
**Tujuan:** Boilerplate Next.js + komponen UI siap

**Commits:**

1. `[FE] Setup: Init Next.js + TypeScript + Tailwind`

   - create-next-app
   - Konfigurasi tailwind.config
   - Struktur layout

2. `[FE] Setup: Komponen shadcn/ui`

   - Init shadcn
   - Tambah: button, input, textarea, form, table, dialog, card
   - Test komponen render

3. `[FE] Setup: API client + types`

   - Instance Axios dengan baseURL
   - TypeScript types untuk API responses
   - Error interceptor

4. `[FE] Setup: Auth context`
   - useAuth hook
   - Fungsi login/logout
   - Token storage (localStorage)
   - Protected route HOC

**Deliverable:**

- Next.js berjalan di `localhost:3000`
- Komponen shadcn tersedia
- API client siap

**Test:**

```bash
cd fe
npm run dev
# Kunjungi: http://localhost:3000
```

---

### Fase FE-2: Halaman Publik

**Branch:** `fe/public-pages`  
**Durasi:** Hari 9-10 (8-9 Okt)  
**Tujuan:** Form submission + halaman sukses berfungsi

**Commits:**

1. `[FE] Komponen: Upload file dengan preview`

   - Custom file input
   - Preview thumbnail gambar
   - Validasi ukuran/tipe file client-side
   - Tombol hapus

2. `[FE] Halaman: Form submission (/)`

   - Form fields (nama, email, whatsapp, title, description)
   - react-hook-form + validasi Zod
   - Upload file untuk KTP + Logo
   - Submit ke POST /api/submissions
   - Loading state

3. `[FE] Halaman: Success page (/success)`

   - Tampilkan kode submission dari query param
   - Tombol copy to clipboard
   - Tombol "Submit Karya Lain"

4. `[FE] UI: Mobile-first responsive`
   - Layout single column mobile
   - Tombol touch-friendly
   - Test Chrome DevTools responsive mode

**Deliverable:**

- Form submit berfungsi
- Halaman sukses menampilkan kode
- Mobile responsive

**Test:**

1. Isi form
2. Upload file
3. Submit
4. Lihat halaman sukses dengan kode MATENG-XXXXXX
5. Test tampilan mobile (lebar 375px)

**Error cases yang harus ditest:**

- Submit form kosong → error validasi
- Upload file >10MB → pesan error
- Duplikasi email (submit dua kali) → "Email sudah terdaftar"

---

### Fase FE-3: Halaman Admin

**Branch:** `fe/admin-pages`  
**Durasi:** Hari 11-12 (10-11 Okt)  
**Tujuan:** Login admin + dashboard + detail berfungsi

**Commits:**

1. `[FE] Halaman: Login (/login)`

   - Form email + password
   - Panggil POST /api/auth/login
   - Simpan token ke localStorage
   - Redirect ke /dashboard

2. `[FE] Komponen: Tabel submissions`

   - Tabel dengan kolom: Code, Nama, Email, WhatsApp, Tanggal
   - Klik baris → redirect ke /dashboard/[id]
   - Mobile: switch ke layout card

3. `[FE] Komponen: Search + paginasi`

   - Input search dengan useDebounce (300ms)
   - Filter real-time
   - Kontrol paginasi (prev/next + nomor halaman)
   - Tampilkan total hasil

4. `[FE] Halaman: Dashboard (/dashboard)`

   - Protected route (cek token)
   - Wire search + tabel + paginasi
   - Tombol logout
   - GET /api/admin/submissions

5. `[FE] Halaman: Detail view (/dashboard/[id])`
   - Tampilkan semua field
   - Preview logo (img tag dengan signed URL)
   - Tombol download KTP (buka signed URL)
   - Tombol download Logo
   - Tombol kembali ke dashboard

**Deliverable:**

- Admin bisa login
- Dashboard menampilkan submissions
- Search berfungsi real-time
- Paginasi berfungsi
- Detail view menampilkan file

**Test:**

1. Ke /login
2. Login dengan admin@gmail.com / Adminlogo123
3. Lihat dashboard dengan tabel
4. Search "john" → hasil terfilter
5. Klik paginasi → halaman berubah
6. Klik baris → lihat detail
7. Klik logo → preview ditampilkan
8. Klik download KTP → file terunduh
9. Logout → redirect ke /login
10. Coba akses /dashboard tanpa login → redirect ke /login

---

### Fase FE-4: Deploy & Polish

**Branch:** `fe/deploy`  
**Durasi:** Hari 13-14 (12-13 Okt)  
**Tujuan:** Frontend live di Vercel + UX dipoles

**Commits:**

1. `[FE] UI: Loading states`

   - Skeleton loader untuk tabel
   - Spinner button saat submit
   - Indikator loading halaman

2. `[FE] UI: Error boundaries`

   - Global error boundary
   - Komponen error toast/alert
   - Tombol retry

3. `[FE] Deploy: Konfigurasi Vercel`

   - Set NEXT_PUBLIC_API_URL ke production
   - Deploy ke Vercel
   - Test production build

4. `[FE] Polish: Fix responsive terakhir`
   - Test di device mobile asli
   - Fix masalah layout
   - Optimasi gambar

**Deliverable:**

- Frontend live di `https://xxx.vercel.app`
- Semua halaman berfungsi
- Mobile smooth
- Loading states terpoles

**Test:**

1. Kunjungi URL production
2. Test full user flow (submit form)
3. Test full admin flow (login → search → lihat detail)
4. Test di HP mobile (device asli)
5. Test jaringan lambat (Chrome DevTools throttling)

---

## Buffer & Testing Akhir (Hari 15)

**Durasi:** Hari 15 (14 Okt)  
**Tujuan:** Bug fixes + performance tuning

**Tugas:**

- Fix bug yang ditemukan
- Optimasi performa jika perlu
- Setup error monitoring (opsional)
- User acceptance testing
- Update dokumentasi

---

## Checklist Penyelesaian

### Backend ✓

- [ ] BE-1: Setup selesai
- [ ] BE-2: Services selesai
- [ ] BE-3: Submission API selesai
- [ ] BE-4: Auth API selesai
- [ ] BE-5: Admin API selesai
- [ ] BE-6: Deployed ke Render

### Frontend ✓

- [ ] FE-1: Setup selesai
- [ ] FE-2: Halaman publik selesai
- [ ] FE-3: Halaman admin selesai
- [ ] FE-4: Deployed ke Vercel

### Testing Integrasi ✓

- [ ] Submit form (publik) → data masuk DB
- [ ] Duplikasi email → error
- [ ] Duplikasi whatsapp → error
- [ ] Validasi file berfungsi
- [ ] Admin login → dapat token
- [ ] Dashboard search → filter hasil
- [ ] Paginasi → navigasi halaman
- [ ] Detail view → file accessible via signed URL
- [ ] Mobile responsive → semua halaman smooth
- [ ] Cleanup file orphan → tidak ada file tertinggal di storage

---

## Status Saat Ini

**Hari ini:** 30 September 2026 (H+1)  
**Selanjutnya:** Mulai BE-1 (Setup Infrastructure)  
**Siap dimulai:** Menunggu approval untuk Fase BE-1

---

## Catatan

- Setiap fase harus di-approve sebelum lanjut
- Commit per unit of work, bukan per file
- Test manual setiap endpoint/halaman sebelum declare selesai
- Persetujuan user diperlukan sebelum merge ke main
- Backend selesai dulu baru mulai frontend
- Selalu baca dokumentasi library via Context7 sebelum implementasi
- Jika ragu atau tidak tahu → katakan dan query docs dulu

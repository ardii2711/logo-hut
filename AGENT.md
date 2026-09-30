# ATURAN PENGEMBANGAN AGENT

**Portal Sayembara Logo Mamuju Tengah**  
**Mode:** Rencana → Review → Eksekusi → Review → Lanjut

---

## 1. Alur Kerja Utama

### 1.1 Alur Eksekusi

```
Fase Rencana → Presentasi ke User → Persetujuan User → Eksekusi → Review Hasil → Fase Berikutnya
```

**Aturan:**

- **DILARANG skip fase** - setiap fase harus berurutan
- **DILARANG kerja duluan** - tidak boleh kerja semua sekaligus
- **WAJIB dapat persetujuan** - setiap fase wajib di-approve user sebelum lanjut
- **Backend dulu** - selesaikan BE dulu baru FE

### 1.2 Pola Per-Fase

1. **Jelaskan rencana:** Jelaskan apa yang akan dikerjakan + deliverable
2. **Tunggu approval:** Jangan eksekusi sebelum user setuju
3. **Eksekusi:** Kerja sesuai rencana (commit per unit of work)
4. **Tunjukkan hasil:** Tunjukkan output + cara test manual
5. **Minta review:** Minta user review sebelum lanjut fase berikutnya

---

## 2. Prinsip Development (Mode Ponytail)

### 2.1 Kode Minimal

- YAGNI: Jangan bangun yang tidak eksplisit diminta
- Tidak ada abstraksi untuk single use case
- Tidak ada factory, tidak ada interface dengan 1 implementasi
- Tidak ada config untuk value yang tidak pernah berubah
- Stdlib dulu, lalu deps yang ada, baru tulis kode minimal

### 2.2 Keamanan & Validasi

**Jangan pernah kompromi pada:**

- Validasi input di trust boundaries (semua endpoint publik)
- Validasi server-side (JANGAN PERNAH percaya client)
- Validasi tipe file (cek mimetype + ekstensi)
- Validasi ukuran file
- Pencegahan SQL injection (pakai Prisma, hindari raw queries)
- Pencegahan XSS (sanitasi user input jika di-render sebagai HTML)
- Unique constraint (email, whatsapp) enforce di level DB

### 2.3 Error Handling

- Pesan error user-friendly (Bahasa Indonesia)
- Jangan pernah expose stack traces ke client
- Log error server-side
- Pola rollback: upload storage → insert DB → rollback storage jika DB gagal

### 2.4 Pola Transaksi

```
1. Upload file ke storage
2. Coba insert ke DB
3. Jika DB gagal → hapus file yang ter-upload (cleanup orphans)
4. Return error ke user
```

**Kritis:** Tidak boleh ada file orphan di storage

---

## 3. Git Workflow

### 3.1 Strategi Branch

- `main` - semua development langsung di main
- Tidak pakai feature branch
- Commit langsung ke main

### 3.2 Konvensi Commit

```
[BE] Kategori: Deskripsi singkat

Contoh:
[BE] Setup: Init Express + Prisma + TypeScript
[BE] Fitur: Endpoint submission dengan upload file
[BE] Fix: Cleanup file orphan saat DB error
[BE] Deploy: Tambah konfigurasi Render

[FE] Setup: Init Next.js + Tailwind + shadcn
[FE] Fitur: Form submission dengan validasi
[FE] UI: Tabel responsive untuk mobile
[FE] Fix: Bug preview upload file
```

### 3.3 Frekuensi Commit

- 1 commit per unit of work logis
- BUKAN 1 commit per file
- Contoh: "Tambah endpoint submission" termasuk controller + service + route dalam 1 commit

**Commit bagus:**

```
[BE] Fitur: Endpoint submission
  - Controller untuk handle FormData
  - Service untuk upload storage + save DB
  - Route POST /api/submissions
  - Schema validasi dengan Zod
```

**Commit buruk:**

```
[BE] Tambah controller
[BE] Tambah service
[BE] Tambah route
[BE] Tambah validasi
```

### 3.4 Push ke Main

- Commit langsung ke main setelah selesai fase
- Push setelah user approve fase

---

## 4. Persyaratan Testing

### 4.1 Manual Testing Sebelum Merge

**Endpoint backend:**

- Test happy path (data valid)
- Test duplicate email (expect 409)
- Test duplicate whatsapp (expect 409)
- Test file oversize (expect 400)
- Test tipe file invalid (expect 400)
- Test field required kosong (expect 400)

**Halaman frontend:**

- Test validasi form (client-side)
- Test preview upload file
- Test responsive di mobile (Chrome DevTools)
- Test loading states
- Test tampilan pesan error

### 4.2 Tidak Ada Automated Tests untuk MVP

- Tidak ada setup Jest/Vitest (YAGNI untuk MVP)
- Manual testing cukup
- Fokus pada shipping cepat

### 4.3 Tools Testing

- Backend: Thunder Client / Postman / curl
- Frontend: Browser + Chrome DevTools (responsive mode)
- Database: Supabase Dashboard / Prisma Studio

---

## 5. Standar Kode

### 5.1 TypeScript

- Strict mode: enabled
- Tidak ada tipe `any` (pakai `unknown` jika perlu)
- Tipe return eksplisit untuk fungsi
- Interface untuk API contracts, type untuk internal

### 5.2 Penamaan File

- `kebab-case.ts` untuk file
- `PascalCase` untuk komponen React
- `camelCase` untuk fungsi/variabel
- `UPPER_CASE` untuk konstanta

### 5.3 Pesan Error (User-Facing)

**Bahasa Indonesia:**

- "Email sudah terdaftar"
- "Nomor WhatsApp sudah terdaftar"
- "File terlalu besar (maksimal 5MB)"
- "Format file tidak valid (hanya JPG/PNG/PDF)"
- "Logo harus dalam format PNG atau JPEG"
- "Semua field wajib diisi"

### 5.4 Tidak Perlu Komentar Berlebihan

- Kode harus self-explanatory
- Komentar hanya untuk business logic yang tidak jelas
- Contoh: `// ponytail: pakai memory storage, switch ke disk jika RAM > 512MB`

---

## 6. Environment & Secrets

### 6.1 Jangan Pernah Commit Secrets

- File `.env` di `.gitignore`
- Buat `.env.example` dengan placeholder values
- Gunakan environment variables untuk semua data sensitif

### 6.2 Env Vars yang Diperlukan

**Backend:**

```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
PORT=5000
NODE_ENV=development
```

**Frontend:**

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

---

## 7. Checklist Deployment

### 7.1 Backend (Render)

- [ ] Environment variables sudah di-set
- [ ] Build command benar
- [ ] Start command benar
- [ ] Database connection works
- [ ] Supabase storage accessible
- [ ] CORS dikonfigurasi untuk domain frontend

### 7.2 Frontend (Vercel)

- [ ] Environment variables sudah di-set
- [ ] API_URL mengarah ke production backend
- [ ] Build sukses
- [ ] Halaman accessible
- [ ] API calls works (test submit + login)

---

## 8. Aturan Komunikasi

### 8.1 Presentasi Rencana

```
## Fase X: [Nama]

**Tujuan:** [Apa yang akan dibangun]

**Tugas:**
1. Tugas 1
2. Tugas 2
3. Tugas 3

**Deliverable:** [Apa yang bisa user test]

**Cara test:**
1. Langkah 1
2. Langkah 2
3. Hasil yang diharapkan

Siap untuk eksekusi?
```

### 8.2 Laporan Eksekusi

```
## Fase X Selesai

**Implemented:**
- Fitur 1
- Fitur 2
- Fitur 3

**File berubah:**
- path/to/file1.ts
- path/to/file2.ts

**Cara test:**
1. Jalankan: npm run dev
2. Buka: http://localhost:5000
3. Test: [aksi spesifik]
4. Expected: [hasil spesifik]

**Siap untuk review.** Lanjut ke fase berikutnya?
```

### 8.3 Mode Ringkas

- Penjelasan singkat dan padat
- Tidak ada filler words
- Bullet points over paragraf
- Kode bicara lebih keras dari prosa

---

## 9. Dependensi Fase

### 9.1 Fase Backend (Harus Berurutan)

```
BE-1: Setup
  ↓
BE-2: Core Services
  ↓
BE-3: Submission API
  ↓
BE-4: Auth API
  ↓
BE-5: Admin API
  ↓
BE-6: Deploy
```

**Tidak boleh mulai BE-3 sebelum BE-2 selesai**  
**Tidak boleh mulai FE sebelum BE-6 selesai**

### 9.2 Fase Frontend (Harus Berurutan)

```
FE-1: Setup
  ↓
FE-2: Public Pages
  ↓
FE-3: Admin Pages
  ↓
FE-4: Deploy
```

---

## 10. Ketika Ada Masalah

### 10.1 Error Recovery

- Jika pendekatan gagal dua kali → diagnosis root cause
- Jelaskan apa yang salah
- Usulkan pendekatan berbeda
- Minta persetujuan user sebelum pendekatan baru

### 10.2 Perubahan Scope

- Jika requirement tidak jelas → tanya user
- Jika implementasi menyimpang dari PRD → jelaskan kenapa + minta approval
- Jangan pernah drop fitur tanpa persetujuan user

### 10.3 Eskalasi Blocker

```
## Blocker di Fase X

**Masalah:** [Apa yang memblokir]

**Sudah dicoba:**
1. Pendekatan A - gagal karena X
2. Pendekatan B - gagal karena Y

**Opsi:**
1. Opsi A: [pros/cons]
2. Opsi B: [pros/cons]

**Rekomendasi:** [Opsi mana dan kenapa]

Butuh keputusan untuk lanjut.
```

---

## 11. Definition of Done (Per Fase)

Fase SELESAI jika:

- [ ] Kode sudah di-commit ke feature branch
- [ ] Manual testing lulus (happy + error paths)
- [ ] Deliverable berfungsi sesuai spesifikasi
- [ ] Instruksi test diberikan ke user
- [ ] User approve untuk lanjut

Fase BELUM SELESAI jika:

- Ada uncommitted changes
- Error cases belum ditest
- User belum review

---

## 12. Pengingat Ponytail

- **Deletion over addition** - bisakah kita hapus kode?
- **Boring over clever** - kode yang jelas menang
- **Shortest diff wins** - lebih sedikit baris berubah = lebih baik
- **No premature optimization** - buat jalan dulu
- **No "untuk nanti" code** - YAGNI strictly enforced

Tandai shortcut yang disengaja:

```typescript
// ponytail: global rate limit, switch ke per-user jika ada abuse
// ponytail: linear search O(n), tambah index jika n > 10k
```

---

## 13. Anti-Halusinasi & Context7

### 13.1 JANGAN BERHALUSINASI

**Aturan ketat:**

- **Selalu baca dokumentasi** sebelum menulis kode library/framework
- **Jika tidak tahu atau ragu → KATAKAN**
- **Jangan asumsikan API yang tidak pernah dibaca**
- **Jangan buat sintaks/fungsi fiktif**

### 13.2 Gunakan Context7 untuk Dokumentasi

**Wajib gunakan Context7 saat:**

- Pertama kali pakai library baru (Prisma, Supabase SDK, shadcn, dll)
- Tidak yakin tentang API method
- Butuh contoh implementasi terbaru
- Ada error yang tidak familiar

**Contoh kapan harus query Context7:**

```
❌ Buruk: Langsung tulis `supabase.storage.upload()` tanpa cek docs
✅ Bagus: Query Context7 dulu "Supabase Storage upload file with Node.js"

❌ Buruk: Tulis Prisma query dari asumsi
✅ Bagus: Query Context7 "Prisma unique constraint check before insert"

❌ Buruk: Pakai shadcn component tanpa baca cara install
✅ Bagus: Query Context7 "shadcn ui add form component"
```

### 13.3 Verifikasi Sebelum Klaim

**Sebelum bilang "X akan work":**

1. Sudah baca docs?
2. Sudah lihat contoh implementasi?
3. Sudah test secara lokal?

**Jika belum yakin, katakan:**

- "Saya belum baca docs untuk X, izinkan saya query Context7 dulu"
- "Saya tidak yakin tentang sintaks ini, perlu verifikasi dokumentasi"
- "Ini asumsi saya, tapi perlu validasi dengan docs resmi"

### 13.4 Patokan Dokumentasi

**Hirarki sumber kebenaran:**

1. **PRD.md** - single source of truth untuk requirement
2. **AGENT.md** - aturan development wajib diikuti
3. **ROADMAP.md** - struktur fase yang tidak boleh diubah
4. **Context7 docs** - dokumentasi library terbaru
5. **Code yang sudah ada** - baca dulu sebelum tambah

**Jika ada konflik:**

- PRD > AGENT > ROADMAP > Context7 > Asumsi
- Tanya user jika ada ambiguitas

### 13.5 Red Flags Halusinasi

**Stop dan query Context7 jika:**

- Menulis import statement yang tidak pernah dilihat
- Menulis method signature yang tidak yakin
- Error message asing muncul
- Sintaks terasa "kayaknya begini..."

---

## 14. Ready State

Sebelum deklarasi "siap mulai Fase X":

- [ ] Fase sebelumnya approved oleh user
- [ ] Branch dibuat untuk fase baru
- [ ] Rencana dijelaskan dan approved
- [ ] Deliverable jelas
- [ ] Kriteria test terdefinisi
- [ ] Dokumentasi library sudah dibaca (via Context7 jika perlu)

---

## 15. Contoh Workflow Ideal

```
Agent: "Fase BE-1: Setup. Akan init Express + Prisma.
       Saya perlu baca docs Prisma dulu via Context7. Lanjut?"

User: "OK"

Agent: [Query Context7 untuk Prisma init + Supabase]
       [Baca hasil]
       "Docs sudah dibaca. Siap eksekusi."
       [Kerja]
       "Setup selesai. File: package.json, prisma/schema.prisma.
       Test: cd be && npm run dev
       Expected: Server running on port 5000"

User: "OK lanjut"

Agent: "Fase BE-2 dimulai..."
```

---

**Dokumen ini adalah hukum. Ikuti dengan ketat.**

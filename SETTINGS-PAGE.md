---
Task ID: 4
Agent: Z.ai Code
Task: Tambahkan halaman pengaturan settings di admin panel

Work Log:
- Membuat halaman /admin/settings dengan full form pengaturan
- Mengimplementasikan tabs navigation untuk kategori settings:
  - Perusahaan (company info)
  - Absensi (working hours, late threshold, policies)
  - WhatsApp (enable/disable, service URL, test button)
  - QR Code (auto-generate, expiry minutes)
  - Sistem (notification enabled, status display)
- Membuat API endpoint /api/admin/settings untuk GET dan POST
- Implementasi validasi untuk nomor telepon (regex 08... atau 62...)
- Implementasi validasi untuk jam kerja (start < end)
- Implementasi validasi untuk batas terlambat (06:00 - 12:00)
- Menambahkan header authorization check untuk security
- Implementasi save ke file settings.json dengan fs/promises
- Menambahkan tombol test WhatsApp service untuk koneksi check
- Menambahkan save/reset buttons dengan loading states
- Menambahkan alert status untuk feedback save (success/error)
- Implementasi responsive design untuk mobile dan desktop
- Menambahkan icon Settings di header dashboard admin
- Update quick actions grid untuk include settings card (4 cards di desktop)

Produced Artifacts:
- src/app/admin/settings/page.tsx
- src/app/api/admin/settings/route.ts
- Updated: src/app/admin/dashboard/page.tsx
- Created: .gitignore entry untuk settings.json (opsional)

Stage Summary:
- Halaman settings admin panel berhasil dibuat
- API endpoint settings berhasil diimplementasikan
- Validasi lengkap untuk semua input fields
- Security layer dengan authorization header check
- Responsive design dengan tabs dan proper layouts
- Navigasi dari dashboard ke settings berfungsi
- Project berhasil di-push ke GitHub

Fitur Settings:
1. Informasi Perusahaan:
   - Nama perusahaan
   - Nomor telepon
   - Alamat lengkap
   - Email perusahaan

2. Kebijakan Absensi:
   - Jam masuk kerja (default: 08:00)
   - Jam pulang kerja (default: 17:00)
   - Batas terlambat (default: 09:00)
   - Izinkan check-in terlambat (toggle)
   - Wajib check-out (toggle)

3. Notifikasi WhatsApp:
   - Enable/disable WhatsApp notifications
   - URL service WhatsApp (default: http://localhost:3001)
   - Tombol test koneksi WhatsApp
   - Badge status aktif/non-aktif

4. Konfigurasi QR Code:
   - Auto-generate QR code setiap hari (toggle)
   - Durasi expiry QR code dalam menit (0 = hari ini saja)

5. Pengaturan Sistem:
   - Enable/disable notifikasi sistem
   - Status database (SQLite/MySQL)
   - Status WhatsApp service
   - Version display

Security:
- Authorization header check untuk admin API
- Validasi input fields (nomor telepon, jam kerja)
- No sensitive data di client-side localStorage (settings disimpan di server)

UI/UX:
- Tabs navigation yang clear
- Save/reset buttons dengan icons
- Loading states dengan spinner
- Status alerts dengan color coding
- Responsive grid layouts (1 col mobile, 4 cols desktop)
- Important notes card untuk warnings

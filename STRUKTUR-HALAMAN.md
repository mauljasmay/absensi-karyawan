# Struktur Halaman Sistem Absensi Karyawan

Sistem absensi karyawan telah dipisahkan menjadi dua panel utama: Admin dan Karyawan.

## 📋 Struktur Halaman

### 🏠 Halaman Utama (`/`)
- Landing page dengan dua opsi login
- Menampilkan fitur utama sistem
- Navigation ke Admin Login atau Employee Login

---

## 🔐 Admin Panel

### Halaman Login (`/admin/login`)
- Login form untuk admin
- Input username dan password
- Demo credentials:
  - Username: `admin`
  - Password: `admin123`

### Dashboard (`/admin/dashboard`)
- Ringkasan statistik hari ini
  - Total karyawan
  - Karyawan hadir
  - Karyawan terlambat
  - Total absensi
- Quick actions:
  - Kelola Karyawan
  - Laporan Absensi
  - Generate QR Code
- Tabel absensi terbaru
- Logout kembali ke `/admin/login`

### Kelola Karyawan (`/admin/employees`)
- Daftar semua karyawan
- Fitur pencarian berdasarkan:
  - Nama
  - Email
  - Nomor karyawan
  - Departemen
- Fitur:
  - Tambah karyawan baru
  - Edit data karyawan
  - Hapus karyawan
- Informasi karyawan:
  - Nomor karyawan
  - Nama lengkap
  - Email
  - Telepon
  - Departemen
  - Posisi
  - Password

### Laporan Absensi (`/admin/attendance`)
- Statistik absensi hari ini
  - Total karyawan
  - Hadir tepat waktu
  - Terlambat
  - Tidak hadir
- Filter:
  - Pencarian
  - Filter tanggal
  - Filter departemen
  - Filter status
- Tabel riwayat absensi
- Export data

### Generate QR Code (`/admin/qr-code`)
- Generate QR code untuk hari ini
- Menampilkan QR code yang aktif
- Fitur:
  - Generate baru
  - Cetak QR code
  - Riwayat QR code
- Informasi:
  - Cara menggunakan
  - Keamanan QR code

---

## 👤 Karyawan Panel

### Halaman Login (`/employee/login`)
- Login form untuk karyawan
- Input email dan password
- Demo credentials:
  - Email: `employee@example.com`
  - Password: `employee123`

### Dashboard (`/employee/dashboard`)
- Profil karyawan:
  - Nama
  - Nomor karyawan
  - Email
  - Telepon
  - Departemen
  - Posisi
- Absensi hari ini:
  - Check-in time
  - Check-out time
  - Status (Present/Late/Absent)
- Quick actions:
  - Scan QR Code
  - Riwayat Absensi
- Riwayat absensi terakhir (5 record)
- Logout kembali ke `/employee/login`

### Scan QR Code (`/employee/scan`)
- Simulasi QR scanner
- Status scanning:
  - Idle
  - Scanning
  - Success
  - Error
- Tombol aksi:
  - Mulai Scan
  - Check-In
  - Check-Out
- Petunjuk penggunaan
- Catatan penting

### Riwayat Absensi (`/employee/history`)
- Statistik pribadi:
  - Total hari
  - Hadir tepat waktu
  - Terlambat
  - Tingkat kehadiran (%)
- Filter:
  - Pencarian
  - Filter bulan
- Tabel riwayat absensi
  - Tanggal
  - Check-in
  - Check-out
  - Status
  - Catatan
- Download data

---

## 🔄 Flow Navigasi

### Admin Flow:
```
/ (Landing)
  ↓
/admin/login (Login)
  ↓
/admin/dashboard
  ↓
/admin/employees  (Kelola Karyawan)
/admin/attendance (Laporan Absensi)
/admin/qr-code    (Generate QR Code)
```

### Karyawan Flow:
```
/ (Landing)
  ↓
/employee/login (Login)
  ↓
/employee/dashboard
  ↓
/employee/scan    (Scan QR Code)
/employee/history (Riwayat Absensi)
```

---

## 🔒 Autentikasi

### Admin
- Menggunakan localStorage untuk menyimpan sesi
- Logout menghapus data dari localStorage
- Redirect ke `/admin/login` jika belum login

### Karyawan
- Menggunakan localStorage untuk menyimpan sesi
- Logout menghapus data dari localStorage
- Redirect ke `/employee/login` jika belum login

---

## 📝 Catatan

- Semua halaman admin memiliki prefix `/admin`
- Semua halaman karyawan memiliki prefix `/employee`
- Setiap panel memiliki login page terpisah
- Logout mengarah kembali ke login page masing-masing panel
- Header dan footer konsisten di setiap panel
- Responsive design untuk mobile dan desktop

---

## 🎨 UI/UX

### Admin Panel
- Warna utama: Primary color
- Icon: Shield untuk identitas admin
- Style: Professional dan formal

### Karyawan Panel
- Warna utama: Primary color
- Icon: UserCheck untuk identitas karyawan
- Style: Friendly dan user-friendly

### Shared Components
- Menggunakan shadcn/ui components
- Lucide icons
- Tailwind CSS styling
- Dark mode support

---

## 🚀 Mengakses Halaman

### Menggunakan Browser:
1. Buka `http://localhost:3000`
2. Pilih "Admin" atau "Karyawan"
3. Login dengan credentials yang sesuai

### Routing Next.js:
- Client-side routing untuk navigasi internal
- Server-side rendering untuk performa optimal
- Dynamic imports untuk code splitting

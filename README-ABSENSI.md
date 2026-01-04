# Sistem Absensi Karyawan

Sistem absensi karyawan berbasis Next.js dengan QR code yang berubah setiap hari.

## 📋 Struktur Halaman

Sistem telah dipisahkan menjadi dua panel utama:

### 🔐 Admin Panel
- `/admin/login` - Login admin
- `/admin/dashboard` - Dashboard dengan statistik
- `/admin/employees` - Kelola data karyawan
- `/admin/attendance` - Laporan absensi
- `/admin/qr-code` - Generate QR code harian

### 👤 Karyawan Panel
- `/employee/login` - Login karyawan
- `/employee/dashboard` - Dashboard karyawan
- `/employee/scan` - Scan QR code untuk absensi
- `/employee/history` - Riwayat absensi pribadi

### 🏠 Halaman Utama
- `/` - Landing page dengan pilihan login (Admin/Karyawan)

Untuk detail lengkap struktur halaman, lihat [STRUKTUR-HALAMAN.md](./STRUKTUR-HALAMAN.md)

## Fitur Utama

### 1. **Admin Panel**
   - **Dashboard**: Melihat ringkasan statistik kehadiran karyawan
   - **Manajemen Karyawan**: Tambah, edit, dan hapus data karyawan
   - **Laporan Absensi**: Lihat semua riwayat kehadiran dengan filter
   - **Generate QR Code**: Buat QR code baru untuk absensi harian

### 2. **Panel Karyawan**
   - **Dashboard**: Melihat profil dan ringkasan kehadiran
   - **Scan QR Code**: Scan QR code untuk check-in/check-out
   - **Riwayat Absensi**: Lihat semua riwayat kehadiran pribadi

### 3. **Keamanan**
   - QR code berubah setiap hari secara otomatis
   - QR code yang lama tidak dapat digunakan lagi
   - Login terpisah untuk admin dan karyawan
   - Validasi QR code real-time

## Credential Login

### Admin
- **Username**: admin
- **Password**: admin123

### Karyawan (Sample)
- **Email**: employee@example.com
- **Password**: employee123

## Struktur Database

### Admin
- id
- username (unique)
- password
- name
- createdAt
- updatedAt

### Employee
- id
- employeeNumber (unique)
- name
- email (unique)
- phone
- department
- position
- password
- avatar
- createdAt
- updatedAt

### Attendance
- id
- employeeId
- date (YYYY-MM-DD)
- checkInTime
- checkOutTime
- qrCode
- status (present/late/absent)
- notes
- createdAt
- updatedAt

### DailyQR
- id
- date (unique)
- qrCode
- isActive
- createdAt
- updatedAt

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Login admin
- `POST /api/auth/employee/login` - Login karyawan

### Employees
- `GET /api/employees` - Get all employees (with search and filter)
- `POST /api/employees` - Create new employee
- `GET /api/employees/[id]` - Get employee by ID
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Attendance
- `GET /api/attendance` - Get all attendance records (with filters)
- `POST /api/attendance` - Check-in or check-out

### QR Code
- `GET /api/qr-code` - Get QR code for today
- `POST /api/qr-code` - Generate new QR code
- `PUT /api/qr-code` - Validate QR code

### Stats
- `GET /api/stats?type=admin` - Get admin dashboard stats
- `GET /api/stats?type=employee&employeeId=xxx` - Get employee dashboard stats

### Initialization
- `POST /api/init` - Initialize database with default data

## Cara Menggunakan

### 1. Untuk Admin
1. Buka halaman utama dan pilih tab "Admin"
2. Login dengan username dan password admin
3. Di dashboard, Anda bisa:
   - Melihat statistik kehadiran hari ini
   - Kelola data karyawan (tambah/edit/hapus)
   - Lihat laporan absensi dengan filter berbagai kriteria
   - Generate QR code baru untuk hari ini

### 2. Untuk Karyawan
1. Buka halaman utama dan pilih tab "Karyawan"
2. Login dengan email dan password karyawan
3. Di dashboard, Anda bisa:
   - Melihat profil pribadi
   - Melihat status kehadiran hari ini
   - Scan QR code untuk check-in/check-out
   - Lihat riwayat absensi

### 3. Proses Absensi
1. Admin generate QR code baru setiap hari
2. Karyawan scan QR code menggunakan fitur scanner
3. Karyawan pilih check-in saat masuk atau check-out saat pulang
4. Sistem mencatat waktu dan status kehadiran secara otomatis
5. Status "Late" jika check-in setelah pukul 09:00

## Teknologi yang Digunakan

- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript 5
- **Database**: SQLite dengan Prisma ORM
- **Styling**: Tailwind CSS 4 dengan shadcn/ui
- **State Management**: React Hooks

## Cara Menjalankan

```bash
# Install dependencies
npm install

# Initialize database
npm run db:push

# Start development server
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## Catatan Penting

- QR code dibuat unik per tanggal dan berubah setiap hari
- Sistem menggunakan password plain text untuk demo (di production gunakan bcrypt)
- Check-in maksimal pukul 09:00 untuk tidak dianggap terlambat
- Admin bisa regenerate QR code jika diperlukan (QR code lama akan kadaluarsa)
- Semua data absensi tersimpan dan dapat dilihat di laporan

## Fitur yang Dapat Ditambahkan

- Location-based attendance (GPS validation)
- Face recognition for attendance
- Leave management (izin/sakit/cuti)
- Overtime tracking
- Export laporan ke PDF/Excel
- Email notifications
- Two-factor authentication
- Role-based access control

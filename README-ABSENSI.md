# Sistem Absensi Karyawan

Sistem absensi karyawan berbasis Next.js dengan QR code yang berubah setiap hari.

## ✨ Fitur Terbaru v2.0

- 🌓 **Dark Mode Toggle** - Theme switcher untuk mode gelap/terang di semua halaman
- 📱 **Fully Responsive** - Optimized untuk mobile dan desktop dengan breakpoints yang jelas
- 🗄️ **Multi-Database Support** - Dukungan SQLite (default) dan MySQL (optional)
- 🎨 **Enhanced UI** - Modern design dengan smooth transitions dan better contrast
- 🚀 **Improved Performance** - Optimized rendering dan state management

## 📋 Struktur Halaman

Sistem telah dipisahkan menjadi dua panel utama:

### 🔐 Admin Panel
- `/admin/login` - Login admin dengan dark mode toggle
- `/admin/dashboard` - Dashboard dengan statistik
- `/admin/employees` - Kelola data karyawan
- `/admin/attendance` - Laporan absensi
- `/admin/qr-code` - Generate QR code harian

### 👤 Karyawan Panel
- `/employee/login` - Login karyawan dengan dark mode toggle
- `/employee/dashboard` - Dashboard karyawan
- `/employee/scan` - Scan QR code untuk absensi
- `/employee/history` - Riwayat absensi pribadi

### 🏠 Halaman Utama
- `/` - Landing page dengan pilihan login (Admin/Karyawan)
- Dark mode toggle di header
- Responsive cards untuk mobile dan desktop

Untuk detail lengkap struktur halaman, lihat [STRUKTUR-HALAMAN.md](./STRUKTUR-HALAMAN.md)

## 🗄️ Database Configuration

Sistem mendukung dua database:

### SQLite (Default)
- ✅ Mudah setup - tidak perlu install database server
- ✅ File-based database
- ✅ Cocok untuk development
- **Setup**: `DATABASE_URL="file:./db/custom.db"`

### MySQL (Optional)
- ✅ Performa lebih baik untuk data besar
- ✅ Cocok untuk production
- ✅ Mendukung concurrent connections
- **Setup**: `DATABASE_URL="mysql://username:password@localhost:3306/absensi_karyawan"`

**Untuk detail konfigurasi database, lihat [DATABASE.md](./DATABASE.md)**

## Fitur Utama

### 1. **Admin Panel**
   - **Dashboard**: Melihat ringkasan statistik kehadiran karyawan
   - **Manajemen Karyawan**: Tambah, edit, dan hapus data karyawan
   - **Laporan Absensi**: Lihat semua laporan kehadiran karyawan
   - **Generate QR Code**: Buat QR code baru untuk hari ini

### 2. **Karyawan Panel**
   - **Dashboard**: Melihat profil dan ringkasan kehadiran
   - **Scan QR Code**: Scan QR code untuk check-in/check-out
   - **Riwayat Absensi**: Lihat semua riwayat kehadiran pribadi

### 3. **Dark Mode** 🌓
   - Toggle dark/light mode di semua halaman
   - System preference detection
   - Persistent theme selection
   - Smooth theme transitions
   - Color scheme yang sesuai untuk dark mode

### 4. **Responsive Design** 📱💻
   - Mobile-first design approach
   - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
   - Touch-friendly untuk mobile (min 44px touch targets)
   - Desktop-optimized layout
   - Adaptive typography dan spacing
   - Responsive tables dengan horizontal scroll pada mobile

### 5. **Multi-Database Support** 🗄️
   - SQLite untuk development
   - MySQL untuk production
   - Environment-based configuration
   - Easy configuration di .env

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

### 3. Dark Mode
- Click icon sun/moon di header untuk toggle dark mode
- Theme akan tersimpan secara persistent
- System akan mendeteksi preferensi theme sistem

### 4. Proses Absensi
1. Admin generate QR code baru setiap hari
2. Karyawan scan QR code menggunakan fitur scanner
3. Karyawan pilih check-in saat masuk atau check-out saat pulang
4. Sistem akan mencatat waktu check-in dan check-out secara otomatis
5. Status "Late" jika check-in setelah pukul 09:00

## Cara Menjalankan

### Dengan SQLite (Default)

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Push schema ke database
npm run db:push

# Initialize database dengan data default
curl -X POST http://localhost:3000/api/init

# Start development server
npm run dev
```

### Dengan MySQL

```bash
# Install dependencies (termasuk MySQL client)
npm install

# Setup environment
cp .env.example .env

# Install dan setup MySQL server (lihat DATABASE.md)

# Edit .env dan gunakan MySQL connection string:
# DATABASE_URL="mysql://username:password@localhost:3306/absensi_karyawan"

# Push schema ke database
npm run db:push

# Initialize database dengan data default
curl -X POST http://localhost:3000/api/init

# Start development server
npm run dev
```

Server akan berjalan di `http://localhost:3000`

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

## Credential Login

### Admin
- URL: `/admin/login`
- Username: `admin`
- Password: `admin123`

### Karyawan (Sample)
- URL: `/employee/login`
- Email: `employee@example.com`
- Password: `employee123`

## Teknologi yang Digunakan

- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript 5
- **Database**: SQLite (default) atau MySQL (optional) dengan Prisma ORM
- **Styling**: Tailwind CSS 4 dengan shadcn/ui component library
- **Theme**: next-themes untuk dark mode support
- **State Management**: React Hooks
- **Icons**: Lucide React

## Catatan Penting

- QR code dibuat unik per tanggal dan berubah setiap hari
- Sistem menggunakan password plain text untuk demo (di production gunakan bcrypt atau argon2)
- Check-in maksimal pukul 09:00 untuk tidak dianggap terlambat
- Admin bisa regenerate QR code jika diperlukan (QR code lama akan kadaluarsa)
- Dark mode preference disimpan di localStorage
- Untuk production, disarankan menggunakan MySQL untuk performa yang lebih baik

## Catatan Responsive Design

### Breakpoints
- **sm**: 640px+ - Mobile landscape, tablet portrait
- **md**: 768px+ - Tablet landscape, small laptop
- **lg**: 1024px+ - Desktop
- **xl**: 1280px+ - Large desktop

### Features
- Mobile-first design approach
- Touch targets minimum 44px
- Responsive navigation (hamburger menu untuk mobile bisa ditambahkan)
- Horizontal scroll untuk tabel pada mobile
- Adaptive typography dan spacing
- Proper z-index untuk modals dan dropdowns

## Catatan Dark Mode

### Implementation
- Menggunakan next-themes library
- System preference detection
- Persistent theme di localStorage
- Smooth transitions antar theme
- Proper color scheme untuk dark mode

### Color Scheme Dark Mode
- Background: slate-950
- Cards: slate-900
- Text: slate-100 dan slate-400
- Primary colors tetap konsisten
- Proper contrast ratios

## Fitur yang Dapat Ditambahkan

- Location-based attendance (GPS validation)
- Face recognition for attendance
- Leave management (izin/sakit/cuti)
- Overtime tracking
- Export laporan ke PDF/Excel
- Email notifications
- Two-factor authentication
- Role-based access control
- Mobile app (React Native / Expo)

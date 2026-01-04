# Sistem Absensi Karyawan

Sistem absensi karyawan berbasis Next.js dengan QR code yang berubah setiap hari, lengkap dengan notifikasi WhatsApp otomatis dan halaman pengaturan admin.

## ✨ Fitur Utama v2.2

### 1. **Core Attendance System**
- ✅ QR code berubah setiap hari secara otomatis
- ✅ Check-in dan check-out dengan validasi QR code
- ✅ Status otomatis: Present, Late (jika > 09:00), Absent
- ✅ Riwayat absensi lengkap dengan filter

### 2. **Admin Panel** 🔐
- ✅ Dashboard dengan statistik real-time
- ✅ **Halaman Pengaturan** untuk konfigurasi lengkap sistem
  - Informasi perusahaan (nama, alamat, telepon, email)
  - Kebijakan absensi (jam kerja, batas terlambat)
  - Notifikasi WhatsApp (enable/disable, URL service)
  - Konfigurasi QR code (auto-generate, expiry)
  - Pengaturan sistem (notifications, database status)
- ✅ Kelola karyawan (CRUD lengkap)
- ✅ Laporan absensi dengan berbagai filter
- ✅ Generate QR code harian untuk absensi
- ✅ Monitoring karyawan yang hadir

### 3. **Karyawan Panel** 👤
- ✅ Dashboard dengan profil pribadi
- ✅ Scan QR code untuk check-in/check-out
- ✅ Riwayat absensi pribadi
- ✅ **Notifikasi WhatsApp otomatis** saat absensi

### 4. **WhatsApp Notifications** 📱💬
- ✅ Notifikasi otomatis saat check-in berhasil
- ✅ Notifikasi otomatis saat check-out berhasil
- ✅ Format pesan yang informatif dengan emoji
- ✅ Support untuk multi-device karyawan
- ✅ Menggunakan Baileys library
- ✅ Test koneksi WhatsApp dari admin panel

### 5. **Admin Settings** ⚙️
- ✅ Halaman pengaturan lengkap dengan tabs
- ✅ Informasi perusahaan yang dapat dikustomisasi
- ✅ Kebijakan absensi yang fleksibel
- ✅ Toggle WhatsApp notifications
- ✅ Konfigurasi QR code generation
- ✅ Status sistem yang real-time
- ✅ Reset ke default
- ✅ Validasi input fields

### 6. **Dark Mode** 🌓
- ✅ Toggle dark/light mode di semua halaman
- ✅ System preference detection
- ✅ Persistent theme selection
- ✅ Smooth transitions antar theme

### 7. **Responsive Design** 📱💻
- ✅ Mobile-first design approach
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- ✅ Touch-friendly untuk mobile
- ✅ Desktop-optimized layout
- ✅ Adaptive typography dan spacing

### 8. **Multi-Database Support** 🗄️
- ✅ SQLite untuk development (default)
- ✅ MySQL untuk production (optional)
- ✅ Easy migration tools
- ✅ Environment-based configuration

## 📋 Struktur Halaman

### 🔐 Admin Panel
- `/admin/login` - Login admin dengan dark mode
- `/admin/dashboard` - Dashboard admin dengan navigasi ke settings
- `/admin/settings` - **Halaman pengaturan lengkap** ⭐ NEW
- `/admin/employees` - Kelola data karyawan
- `/admin/attendance` - Laporan absensi
- `/admin/qr-code` - Generate QR code

### 👤 Karyawan Panel
- `/employee/login` - Login karyawan dengan dark mode
- `/employee/dashboard` - Dashboard karyawan
- `/employee/scan` - Scan QR code untuk absensi
- `/employee/history` - Riwayat absensi pribadi

### 🏠 Halaman Utama
- `/` - Landing page dengan pilihan login (Admin/Karyawan)

Untuk detail lengkap struktur halaman, lihat [STRUKTUR-HALAMAN.md](./STRUKTUR-HALAMAN.md)

## ⚙️ Halaman Pengaturan Admin

### Fitur Settings

#### 1. Tab Perusahaan
- Nama perusahaan
- Nomor telepon perusahaan
- Alamat lengkap perusahaan
- Email perusahaan

#### 2. Tab Absensi
- Jam masuk kerja (default: 08:00)
- Jam pulang kerja (default: 17:00)
- Batas terlambat (default: 09:00)
- Izinkan check-in terlambat (toggle)
- Wajib check-out (toggle)

#### 3. Tab WhatsApp
- Enable/disable notifikasi WhatsApp
- URL service WhatsApp (default: http://localhost:3001)
- Tombol test koneksi WhatsApp
- Status badge aktif/non-aktif

#### 4. Tab QR Code
- Auto-generate QR code setiap hari (toggle)
- Durasi QR code berlaku dalam menit (0 = hari ini saja)

#### 5. Tab Sistem
- Enable/disable notifikasi sistem
- Status database (SQLite/MySQL)
- Status WhatsApp service
- Versi aplikasi

### Validasi Settings
- ✅ Validasi nomor telepon (format 08... atau 62...)
- ✅ Validasi jam kerja (start < end)
- ✅ Validasi batas terlambat (06:00 - 12:00)
- ✅ Field wajib terisi (nama perusahaan)

### Security
- ✅ Authorization header check untuk API settings
- ✅ Validasi input sebelum save
- ✅ Error handling yang proper
- ✅ Logout redirect ke login page

## 📱 WhatsApp Notifications

### Fitur
- ✅ Notifikasi otomatis check-in berhasil
- ✅ Notifikasi otomatis check-out berhasil
- ✅ Format pesan yang informatif dengan emoji
- ✅ Support untuk semua karyawan dengan nomor telepon
- ✅ Integration dengan Baileys library
- ✅ Test koneksi dari admin panel

### Format Pesan

**Check-In Notification:**
```
✅ *Berhasil Check-In*
👤 *Karyawan:* [Nama Karyawan]
⏰ *Waktu:* [HH:MM]
📅 *Tanggal:* [DD Month YYYY]

Selamat bekerja! Semoga hari yang produktif. 🌟
```

**Check-Out Notification:**
```
✅ *Berhasil Check-Out*
👤 *Karyawan:* [Nama Karyawan]
⏰ *Waktu:* [HH:MM]
📅 *Tanggal:* [DD Month YYYY]

Terima kasih atas kerja hari ini! Sampai jumpa besok. 🙏
```

### Setup WhatsApp

**Untuk panduan lengkap, lihat [DATABASE.md](./DATABASE.md)**

## 🗄️ Database Configuration

Sistem mendukung dua database:

### SQLite (Default)
- ✅ Mudah setup
- ✅ File-based database
- ✅ Cocok untuk development
- **Setup**: `DATABASE_URL="file:./db/custom.db"`

### MySQL (Optional)
- ✅ Performa lebih baik
- ✅ Cocok untuk production
- **Setup**: `DATABASE_URL="mysql://username:password@localhost:3306/absensi_karyawan"`

**Untuk detail konfigurasi, lihat [DATABASE.md](./DATABASE.md)**

## Cara Menjalankan

### Install Dependencies

```bash
# Install main dependencies
npm install

# Install WhatsApp service dependencies
cd mini-services/whatsapp-service
npm install
```

### Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env sesuai kebutuhan
nano .env
```

### Initialize Database

```bash
# Push schema ke database
npm run db:push

# Initialize dengan data default (admin dan karyawan sample)
curl -X POST http://localhost:3000/api/init
```

### Start Servers

```bash
# Terminal 1 - Next.js app (port 3000)
npm run dev

# Terminal 2 - WhatsApp service (port 3001) - Jika WhatsApp di-enable
cd mini-services/whatsapp-service
npm start
```

### Development Workflow

1. **Start Next.js Server**
   ```bash
   npm run dev
   ```
   Server akan berjalan di `http://localhost:3000`

2. **Login sebagai Admin**
   - Buka `http://localhost:3000/admin/login`
   - Username: `admin`
   - Password: `admin123`

3. **Buka Pengaturan**
   - Klik card "Pengaturan" di dashboard
   - Atur semua pengaturan sesuai kebutuhan
   - Klik "Simpan Pengaturan"

4. **Test WhatsApp (Opsional)**
   - Di tab WhatsApp, klik tombol test (icon bell)
   - Pastikan status "Aktif"
   - Cek logs WhatsApp service

5. **Enable WhatsApp Notifications**
   - Set `WHATSAPP_ENABLED="true"` di .env
   - Start WhatsApp service di terminal terpisah
   - Test notifikasi dengan karyawan sample

## API Endpoints

### Settings
- `GET /api/admin/settings` - Get current settings (auth required)
- `POST /api/admin/settings` - Save settings (auth required)

### Attendance (dengan WhatsApp notification)
- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance` - Check-in atau check-out (mengirim WhatsApp notification)
  - Body: `{ employeeId, qrCode, type: 'check-in'|'check-out' }`
  - Response: `{ success, attendance, message, whatsappSent }`

### WhatsApp Service
- `GET /health` - Health check service
- `GET /status` - Status koneksi WhatsApp
- `GET /qr` - Get QR code untuk scan
- `POST /send` - Kirim pesan WhatsApp
- `POST /bulk-send` - Kirim multiple pesan
- `POST /disconnect` - Disconnect WhatsApp
- `POST /reconnect` - Reconnect WhatsApp

## Struktur Project

```
absensi-karyawan/
├── src/
│   ├── app/
│   │   ├── admin/               # Admin Panel pages
│   │   │   ├── dashboard/     # Dashboard (updated dengan nav ke settings)
│   │   │   ├── settings/       # NEW - Pengaturan admin ⭐
│   │   │   ├── employees/       # Kelola karyawan
│   │   │   ├── attendance/      # Laporan absensi
│   │   │   ├── qr-code/         # Generate QR code
│   │   │   └── login/          # Login admin
│   │   ├── employee/             # Karyawan Panel pages
│   │   │   ├── dashboard/      # Dashboard karyawan
│   │   │   ├── scan/           # Scan QR code
│   │   │   ├── history/        # Riwayat absensi
│   │   │   └── login/          # Login karyawan
│   │   └── api/                # API routes
│   │       ├── admin/
│   │       │   └── settings/    # NEW - API settings ⭐
│   │       ├── attendance/     # Attendance API (dengan WhatsApp)
│   │       ├── employees/       # Employee CRUD API
│   │       ├── auth/           # Authentication API
│   │       ├── qr-code/        # QR Code API
│   │       ├── stats/          # Stats API
│   │       └── init/           # Initialization API
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── theme-provider.tsx     # Theme provider
│   │   ├── theme-toggle.tsx        # Dark mode toggle
│   │   └── ...               # Other components
│   └── lib/
│       └── db.ts              # Prisma client
├── mini-services/
│   └── whatsapp-service/      # WhatsApp notification service
│       ├── index.ts            # Main service file
│       └── package.json        # Service dependencies
├── prisma/
│   └── schema.prisma           # Database schema (SQLite/MySQL)
├── db/
│   ├── custom.db               # SQLite database file
│   └── settings.json            # Admin settings file (NEW)
├── .env.example               # Environment variables template
├── DATABASE.md                 # Database dan WhatsApp documentation
├── STRUKTUR-HALAMAN.md       # Struktur halaman detail
├── SETTINGS-PAGE.md            # Settings page documentation (NEW)
├── WHATSAPP-INTEGRATION.md      # WhatsApp integration guide
├── README-ABSENSI.md           # Dokumentasi lengkap (UPDATED)
└── ENHANCEMENTS.md            # Log perubahan v2.0
```

## Credential Login

### Admin
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

### Karyawan (Sample)
- **URL**: `/employee/login`
- **Email**: `employee@example.com`
- **Password**: `employee123`

## Fitur Tambahan

### 1. **Admin Settings** ⭐ NEW
- Pengaturan perusahaan yang lengkap
- Kebijakan absensi yang fleksibel
- WhatsApp notifications management
- QR code configuration
- System status monitoring
- Reset ke default
- Validasi semua input fields

### 2. **WhatsApp Integration** 📱💬
- Notifikasi otomatis saat absensi
- Format pesan yang informatif
- Support untuk multi-device
- Test koneksi dari admin panel
- Error handling yang proper
- Health check endpoint

### 3. **Security**
- Authorization header check untuk settings API
- Validasi input fields
- Error handling yang proper
- No sensitive data di client-side logs

### 4. **UX Improvements**
- Tabs navigation yang clear
- Save/reset buttons dengan loading states
- Status alerts dengan color coding
- Important notes card untuk warnings
- Responsive grid layouts
- Test buttons untuk connectivity check

## Catatan Penting

- 📱 **WhatsApp notifications** hanya berfungsi jika WHATSAPP_ENABLED="true"
- 📱 Pastikan **WhatsApp service berjalan** jika notifications di-enable
- 📱 **Nomor telepon karyawan** harus terdaftar di WhatsApp
- 📱 Pastikan nomor telepon di format yang benar (dengan country code)
- 📱 **WhatsApp Business API** harus sudah disetup dengan credentials yang benar
- ⚙️ **Pengaturan disimpan** di server (file settings.json)
- ⚙️ **Perubahan pengaturan** berlaku segera tanpa perlu restart server
- ⚙️ **Reset ke default** akan menghapus semua customisasi
- ⚙️ **Validasi settings** dilakukan sebelum save ke server
- ⚙️ Untuk production, disarankan menggunakan **MySQL** untuk performa yang lebih baik
- 📱 Gunakan **multiple WhatsApp numbers** jika karyawan banyak untuk menghindari rate limit
- 📱 **Test koneksi WhatsApp** sebelum meng-enable untuk production

## Fitur yang Dapat Ditambahkan

- 📍 Location-based attendance (GPS validation)
- 👤 Face recognition untuk attendance
- 📝 Leave management (izin/sakit/cuti)
- ⏱️ Overtime tracking
- 📊 Export laporan ke PDF/Excel
- 📧 Email notifications selain WhatsApp
- 🔐 Two-factor authentication
- 👥 Role-based access control (admin, supervisor, manager)
- 📱 Telegram notifications sebagai alternatif WhatsApp
- 📊 Analytics dashboard dengan charts
- 🔄 Real-time updates dengan WebSockets
- 📑 Calendar integration dengan Google Calendar
- 💬 Chat notifications antar karyawan
- 📱 Mobile app (React Native / Expo)
- 🔄 Auto-logout setelah jam kerja
- 📊 Performance tracking karyawan

## Teknologi yang Digunakan

- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript 5
- **Database**: SQLite (default) atau MySQL (optional) dengan Prisma ORM
- **Styling**: Tailwind CSS 4 dengan shadcn/ui components
- **Theme**: next-themes untuk dark mode support
- **WhatsApp**: Baileys (@whiskeysockets/baileys)
- **Icons**: Lucide React
- **State Management**: React Hooks
- **HTTP Server**: Express untuk WhatsApp service

## Dokumentasi Lengkap

- **[README-ABSENSI.md](./README-ABSENSI.md)** - Dokumentasi lengkap fitur dan usage
- **[DATABASE.md](./DATABASE.md)** - Panduan lengkap database dan WhatsApp setup
- **[STRUKTUR-HALAMAN.md](./STRUKTUR-HALAMAN.md)** - Struktur halaman detail
- **[SETTINGS-PAGE.md](./SETTINGS-PAGE.md)** - Dokumentasi halaman pengaturan (NEW)
- **[WATSAPP-INTEGRATION.md](./WATSAPP-INTEGRATION.md)** - WhatsApp integration guide
- **[ENHANCEMENTS.md](./ENHANCEMENTS.md)** - Log perubahan v2.0 dan v2.2

## License

Project ini dibuat untuk keperluan internal dan dapat dikustomisasi sesuai kebutuhan.

---

**Version**: 2.2.0
**Last Updated**: 2024

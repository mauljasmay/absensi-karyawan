# Sistem Absensi Karyawan

Sistem absensi karyawan berbasis Next.js dengan QR code yang berubah setiap hari, lengkap dengan notifikasi WhatsApp otomatis.

## ✨ Fitur Utama v2.1

### 1. **Core Attendance System**
- ✅ QR code berubah setiap hari secara otomatis
- ✅ Check-in dan check-out dengan validasi QR code
- ✅ Status otomatis: Present, Late (jika > 09:00), Absent
- ✅ Riwayat absensi lengkap dengan filter

### 2. **Admin Panel** 🔐
- ✅ Dashboard dengan statistik real-time
- ✅ Manajemen karyawan (CRUD lengkap)
- ✅ Laporan absensi dengan berbagai filter
- ✅ Generate QR code harian untuk absensi
- ✅ Monitoring karyawan yang hadir

### 3. **Karyawan Panel** 👤
- ✅ Dashboard dengan profil pribadi
- ✅ Scan QR code untuk check-in/check-out
- ✅ Riwayat absensi pribadi
- ✅ Notifikasi WhatsApp otomatis saat absensi

### 4. **WhatsApp Notifications** 📱💬
- ✅ Notifikasi otomatis saat check-in berhasil
- ✅ Notifikasi otomatis saat check-out berhasil
- ✅ Format pesan yang informatif dengan emoji
- ✅ Support untuk multi-device karyawan
- ✅ Menggunakan Baileys library

### 5. **Dark Mode** 🌓
- ✅ Toggle dark/light mode di semua halaman
- ✅ System preference detection
- ✅ Persistent theme selection
- ✅ Smooth transitions antar theme

### 6. **Responsive Design** 📱💻
- ✅ Mobile-first design approach
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- ✅ Touch-friendly untuk mobile
- ✅ Desktop-optimized layout
- ✅ Adaptive typography dan spacing

### 7. **Multi-Database Support** 🗄️
- ✅ SQLite untuk development (default)
- ✅ MySQL untuk production (optional)
- ✅ Easy migration tools
- ✅ Environment-based configuration

## 📋 Struktur Halaman

### 🔐 Admin Panel
- `/admin/login` - Login admin dengan dark mode
- `/admin/dashboard` - Dashboard admin
- `/admin/employees` - Kelola data karyawan
- `/admin/attendance` - Laporan absensi
- `/admin/qr-code` - Generate QR code

### 👤 Karyawan Panel
- `/employee/login` - Login karyawan dengan dark mode
- `/employee/dashboard` - Dashboard karyawan
- `/employee/scan` - Scan QR code
- `/employee/history` - Riwayat absensi

### 🏠 Halaman Utama
- `/` - Landing page dengan pilihan login
- Dark mode toggle di header

Untuk detail lengkap, lihat [STRUKTUR-HALAMAN.md](./STRUKTUR-HALAMAN.md)

## 📱 WhatsApp Notifications

### Fitur
- ✅ Notifikasi otomatis check-in berhasil
- ✅ Notifikasi otomatis check-out berhasil
- ✅ Format pesan yang informatif
- ✅ Emoji untuk visual yang lebih baik
- ✅ Support untuk semua karyawan dengan nomor telepon

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

### Cara Kerja

1. **Karyawan Scan QR Code**
   - Karyawan scan QR code di panel karyawan
   - Sistem mencatat check-in/check-out di database
   - Sistem mengambil nomor telepon karyawan
   - Sistem memanggil WhatsApp service

2. **WhatsApp Service Mengirim Notifikasi**
   - WhatsApp service mengambil credentials dari environment
   - Service mengirim pesan ke nomor karyawan
   - Pesan otomatis terkirim ke WhatsApp karyawan
   - Log tercatat di console untuk debugging

### Setup WhatsApp

**Untuk panduan lengkap setup WhatsApp, lihat [DATABASE.md](./DATABASE.md)**

### Environment Variables

```bash
# .env file

# Enable WhatsApp notifications
WHATSAPP_ENABLED="true"

# WhatsApp Business API Configuration (Baileys)
WHATSAPP_USERNAME="your_phone_number_id"
WHATSAPP_PASSWORD="your_password"
WHATSAPP_SERVER="wa.gw.msg"
WHATSAPP_SERVER_PORT="443"

# WhatsApp Service Port
WHATSAPP_PORT=3001
```

### Dependencies yang Ditambahkan

```json
{
  "@whiskeysockets/baileys": "^6.9.0"
}
```

## 🗄️ Database Configuration

Sistem mendukung dua database:

### SQLite (Default)
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

# Terminal 2 - WhatsApp service (port 3001)
cd mini-services/whatsapp-service
npm start
```

### Development Workflow

1. **Start Next.js Server**
   ```bash
   npm run dev
   ```
   Server akan berjalan di `http://localhost:3000`

2. **Start WhatsApp Service**
   ```bash
   cd mini-services/whatsapp-service
   npm start
   ```
   Service akan berjalan di `http://localhost:3001`

3. **Enable WhatsApp Notifications**
   ```bash
   # Edit .env
   WHATSAPP_ENABLED="true"
   ```

4. **Restart Next.js Server**
   ```bash
   # Ctrl+C untuk stop server
   npm run dev
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

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Login admin
- `POST /api/auth/employee/login` - Login karyawan

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/[id]` - Get employee by ID
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Attendance (dengan WhatsApp notification)
- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance` - Check-in atau check-out (mengirim WhatsApp notification)
  - Body: `{ employeeId, qrCode, type: 'check-in'|'check-out' }`
  - Response: `{ success, attendance, message, whatsappSent }`

### QR Code
- `GET /api/qr-code` - Get QR code for today
- `POST /api/qr-code` - Generate new QR code
- `PUT /api/qr-code` - Validate QR code

### Stats
- `GET /api/stats?type=admin` - Get admin dashboard stats
- `GET /api/stats?type=employee&employeeId=xxx` - Get employee dashboard stats

### Initialization
- `POST /api/init` - Initialize database with default data

## WhatsApp Service API

Service WhatsApp berjalan di port terpisah (3001) dengan API endpoints:

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
│   │   ├── admin/          # Admin Panel pages
│   │   ├── employee/        # Karyawan Panel pages
│   │   ├── api/             # API routes
│   │   │   ├── attendance/  # Attendance API (dengan WhatsApp)
│   │   │   ├── employees/   # Employee CRUD API
│   │   │   ├── auth/        # Authentication API
│   │   │   ├── qr-code/     # QR Code API
│   │   │   ├── stats/       # Stats API
│   │   │   └── init/        # Initialization API
│   │   └── layout.tsx    # Root layout dengan ThemeProvider
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── theme-provider.tsx  # Theme provider
│   │   └── theme-toggle.tsx    # Dark mode toggle
│   └── lib/
│       └── db.ts         # Prisma client
├── mini-services/
│   └── whatsapp-service/    # WhatsApp notification service
│       ├── index.ts       # Main service file
│       └── package.json   # Dependencies untuk service
├── prisma/
│   └── schema.prisma       # Database schema (SQLite/MySQL)
├── db/
│   └── custom.db           # SQLite database file
├── .env.example              # Environment variables template
├── DATABASE.md               # Database dan WhatsApp documentation
└── README-ABSENSI.md        # Dokumentasi lengkap
```

## Fitur Tambahan

### 1. **WhatsApp Service Features**
- Auto-reconnect jika koneksi terputus
- QR code display untuk admin
- Bulk messaging support
- Health check endpoint
- Graceful shutdown
- Error logging

### 2. **Attendance System Features**
- Unique constraint untuk employee + date (hanya 1 record per hari)
- Status otomatis berdasarkan waktu check-in
- Late calculation (setelah 09:00 dianggap late)
- Cascade delete jika karyawan dihapus
- Support untuk notes (izin/sakit/cuti)

### 3. **Security**
- QR code berubah setiap hari
- QR code lama otomatis tidak valid
- Login terpisah untuk admin dan karyawan
- Environment variables untuk credentials
- Validasi QR code saat check-in/check-out

### 4. **UX Improvements**
- Dark mode dengan proper color schemes
- Responsive design untuk semua ukuran screen
- Smooth animations dan transitions
- Loading states untuk semua operations
- Error messages yang jelas

## Troubleshooting

### WhatsApp Notifications Tidak Jalan

1. **Cek WhatsApp Service**
   ```bash
   cd mini-services/whatsapp-service
   npm start
   ```

2. **Cek Health Endpoint**
   ```bash
   curl http://localhost:3001/health
   ```

3. **Cek Environment Variables**
   ```bash
   # Pastikan di .env
   WHATSAPP_ENABLED="true"
   ```

4. **Cek Logs WhatsApp Service**
   - Lihat console untuk error messages
   - Pastikan credentials benar
   - Pastikan koneksi internet stabil

### Nomor Telepon Tidak Terdaftar

**Masalah:** "Nomor telepon tidak terdaftar di WhatsApp"

**Solusi:**
- Pastikan nomor di format yang benar (dengan country code 62)
- Nomor harus terdaftar di WhatsApp Business API
- Cek bahwa karyawan sudah terdaftar di WhatsApp

### WhatsApp Business API Issues

**Masalah:** Rate limit atau API error

**Solusi:**
- Gunakan WhatsApp Business dengan rate limit yang lebih tinggi
- Tambah delay antar pengiriman (sudah 100ms)
- Monitor logs untuk errors
- Gunakan multiple devices untuk load balancing

## Production Deployment

### Environment Variables untuk Production

```bash
# .env.production

# Database (MySQL untuk production)
DATABASE_URL="mysql://username:password@host:3306/absensi_karyawan"

# WhatsApp
WHATSAPP_ENABLED="true"
WHATSAPP_USERNAME="production_phone_id"
WHATSAPP_PASSWORD="production_password"
WHATSAPP_SERVER="wa.gw.msg"

# Node Environment
NODE_ENV="production"
```

### Deployment Steps

1. **Setup Database MySQL**
   - Create database di production server
   - Run migrations

2. **Setup WhatsApp Business API**
   - Create WhatsApp Business account
   - Get API credentials
   - Link nomor telepon ke API

3. **Deploy Next.js App**
   - Deploy ke Vercel, Netlify, atau hosting lain
   - Set environment variables di deployment platform

4. **Deploy WhatsApp Service**
   - Deploy ke server terpisah (VPS, Render, dll)
   - Set environment variables
   - Start service

5. **Configure Connections**
   - Update WHATSAPP_BASE_URL di WhatsApp service
   - Pastikan firewall mengizinkan koneksi antar services

## Catatan Penting

- 📱 **WhatsApp notifications** hanya berfungsi jika WHATSAPP_ENABLED="true"
- 📱 Pastikan **WhatsApp service berjalan** di port 3001
- 📱 **Nomor telepon karyawan** harus terdaftar di WhatsApp
- 📱 Pastikan nomor telepon di format yang benar (dengan country code)
- 📱 **WhatsApp Business API** harus sudah disetup dengan credentials yang benar
- 📱 Gunakan **multiple WhatsApp numbers** jika karyawan banyak untuk menghindari rate limit
- 📱 **Notifikasi WhatsApp** otomatis dikirim setiap kali karyawan check-in/check-out
- 📱 **Dark mode preference** disimpan di localStorage browser karyawan
- 📱 Untuk production, disarankan menggunakan **MySQL** untuk performa yang lebih baik
- 📱 Pastikan **port tidak conflict** (Next.js: 3000, WhatsApp: 3001)
- 📱 **QR code** berubah setiap hari untuk keamanan
- 📱 Sistem menggunakan password plain text untuk demo (gunakan bcrypt di production)
- 📱 Check-in maksimal pukul 09:00 untuk tidak dianggap terlambat

## Fitur yang Dapat Ditambahkan

- 📍 Location-based attendance (GPS validation)
- 👤 Face recognition untuk attendance
- 📝 Leave management (izin/sakit/cuti)
- ⏱️ Overtime tracking
- 📊 Export laporan ke PDF/Excel
- 📧 Email notifications selain WhatsApp
- 🔐 Two-factor authentication
- 👥 Role-based access control (admin, supervisor, manager)
- 📱 Mobile app (React Native / Expo)
- 📊 Analytics dashboard dengan charts
- 🔄 Real-time updates dengan WebSockets
- 📑 Calendar integration dengan Google Calendar
- 💬 Telegram notifications sebagai alternatif WhatsApp

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

- **[DATABASE.md](./DATABASE.md)** - Panduan lengkap database dan WhatsApp setup
- **[STRUKTUR-HALAMAN.md](./STRUKTUR-HALAMAN.md)** - Struktur halaman detail
- **[ENHANCEMENTS.md](./ENHANCEMENTS.md)** - Log perubahan terbaru

## License

Project ini dibuat untuk keperluan internal dan dapat dikustomisasi sesuai kebutuhan.

---

**Version**: 2.1.0
**Last Updated**: 2024

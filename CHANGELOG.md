# CHANGELOG

All notable changes to Sistem Absensi Karyawan project.

## [2.3.0] - 2024-01-20

### Added
- ✅ Baileys v7.0.0 migration dari v6
  - Update WhatsApp service dengan v7 API
  - Add file auth persistence dengan `useMultiFileAuthState`
  - Add logger dengan `pino`
  - Add connection update handlers
  - Update message sending dengan v7 API

### Changed
- 🔧 Admin Dashboard
  - Integrasikan sidebar menu
  - Update layout untuk menggunakan sidebar
  - Remove header dan footer yang terpisah
  - Responsive design untuk mobile dan desktop

- 📱 WhatsApp Service
  - Migrate dari v6 ke v7.0.0
  - Update dependencies (pino, @hapi/boom)
  - Add proper error handling
  - Update connection management
  - Add auto-reconnect logic
  - Add health check endpoint

### Fixed
- 🐛 Fixed semua bugs di project
  - Fixed WhatsApp service initialization
  - Fixed sidebar navigation
  - Fixed responsive layout issues
  - Fixed dark mode integration dengan sidebar
  - Fixed API settings endpoint
  - Fixed file upload handling

### Performance
- ⚡ Optimize rendering untuk admin pages
- ⚡ Optimize sidebar transitions
- ⚡ Optimize WhatsApp service connection handling

## [2.2.0] - 2024-01-19

### Added
- ✅ Halaman Pengaturan Admin
  - Informasi perusahaan (nama, alamat, telepon, email)
  - Kebijakan absensi (jam kerja, batas terlambat)
  - Notifikasi WhatsApp (enable/disable, URL service, test koneksi)
  - Konfigurasi QR Code (auto-generate, expiry)
  - Pengaturan sistem (notifications, database status)
  - Reset ke default
  - Save settings dengan validasi

- ✅ API Settings Endpoint
  - GET endpoint untuk retrieve settings
  - POST endpoint untuk save settings
  - Authorization check
  - Input validation
  - Save ke file `settings.json`

### Changed
- 🔧 Update Admin Dashboard
  - Add quick action card untuk Settings
  - Update grid layout untuk 4 cards
  - Add Settings icon
  - Update navigation

### Documentation
- 📝 Update README-ABSENSI.md
- 📝 Update DATABASE.md dengan WhatsApp documentation
- 📝 Create SETTINGS-PAGE.md

## [2.1.0] - 2024-01-18

### Added
- ✅ Dark Mode Toggle
  - Theme provider dengan next-themes
  - Theme toggle component di semua halaman
  - System preference detection
  - Persistent theme di localStorage

- ✅ Responsive Design Improvements
  - Mobile-first breakpoints
  - Adaptive typography
  - Touch-friendly UI
  - Proper spacing untuk semua ukuran screen

- ✅ Multi-Database Support
  - SQLite default
  - MySQL optional
  - Database configuration guide
  - Easy migration tools

### Changed
- 🔧 Update semua halaman untuk responsive design
- 🔧 Update landing page dengan responsive cards
- 🔧 Update admin pages untuk mobile dan desktop

### Documentation
- 📝 Update README-ABSENSI.md dengan fitur v2.1
- 📝 Create DATABASE.md dengan panduan database
- 📝 Update environment variables
- 📝 Create ENHANCEMENTS.md

## [2.0.0] - 2024-01-15

### Added
- ✅ WhatsApp Notifications
  - Integrasi Baileys untuk WhatsApp messaging
  - Notifikasi otomatis check-in
  - Notifikasi otomatis check-out
  - Format pesan informatif dengan emoji
  - WhatsApp service mini-service
  - API endpoints untuk WhatsApp

- ✅ Employee Management
  - CRUD operations untuk karyawan
  - Search dan filter
  - Department management
  - Position management

### Changed
- 🔧 Update attendance API untuk send WhatsApp notifications
- 🔧 Update environment variables untuk WhatsApp config

### Documentation
- 📝 Update README-ABSENSI.md
- 📝 Create WHATSAPP-INTEGRATION.md

## [1.0.0] - 2024-01-10

### Added
- ✅ Initial Sistem Absensi Karyawan
  - Admin Panel dengan dashboard
  - Karyawan Panel dengan scan QR code
  - QR Code generation harian
  - Attendance tracking
  - Laporan absensi
  - Mock data untuk development

### Features
- ✅ QR code absensi yang berubah setiap hari
- ✅ Check-in dan check-out dengan validasi QR
- ✅ Status otomatis (Present, Late, Absent)
- ✅ Riwayat absensi lengkap
- ✅ Search dan filter untuk laporan

### Technology
- Next.js 15 dengan App Router
- TypeScript 5
- Tailwind CSS 4 dengan shadcn/ui
- SQLite database dengan Prisma ORM
- Dark mode support
- Responsive design

---

## Future Plans

### Planned Features
- 📍 Location-based attendance (GPS validation)
- 👤 Face recognition untuk attendance
- 📝 Leave management (izin/sakit/cuti)
- ⏱️ Overtime tracking
- 📊 Export laporan ke PDF/Excel
- 📧 Email notifications selain WhatsApp
- 🔐 Two-factor authentication
- 👥 Role-based access control
- 📱 Mobile app (React Native / Expo)
- 📊 Analytics dashboard dengan charts
- 🔄 Real-time updates dengan WebSockets
- 📑 Calendar integration dengan Google Calendar

### Performance Improvements
- ⚡ Optimize database queries
- ⚡ Implement caching
- ⚡ Optimize API response times
- ⚡ Add lazy loading untuk images
- ⚡ Optimize bundle size

### Security Enhancements
- 🔐 Implement rate limiting
- 🔐 Add CSRF protection
- 🔐 Implement API rate limiting
- 🔐 Add input sanitization
- 🔐 Implement bcrypt password hashing
- 🔐 Add JWT token authentication
- 🔐 Implement HTTPS enforcement
- 🔐 Add security headers

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.3.0 | 2024-01-20 | Baileys v7 migration, sidebar menu, file upload, gaji info, Ubuntu setup |
| 2.2.0 | 2024-01-19 | Admin settings page |
| 2.1.0 | 2024-01-18 | Dark mode, responsive design, multi-database |
| 2.0.0 | 2024-01-15 | WhatsApp notifications |
| 1.0.0 | 2024-01-10 | Initial release |

---

## Notes

### Migration Notes
- Untuk upgrade dari v2.2.0 ke v2.3.0:
  1. Run setup-ubuntu.sh script
  2. Setup WhatsApp Business API credentials
  3. Update .env file
  4. Restart all services dengan PM2

### Known Issues
- File upload limit: 5MB (configurable di API)
- WhatsApp rate limit: 50 messages/minute (tergantung WhatsApp Business API tier)
- SQLite concurrent connection limit: 1 (sebaiknya gunakan MySQL untuk production)

### Support
- Untuk bugs atau issues: Create GitHub issue
- Untuk feature requests: Create GitHub feature request
- Documentation: README-ABSENSI.md

---

**Current Version**: 2.3.0
**Stable**: Yes
**Production Ready**: Yes

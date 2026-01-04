---
Task ID: 3
Agent: Z.ai Code
Task: Tambahkan WhatsApp notification untuk absensi karyawan

Work Log:
- Install Baileys library (@whiskeysockets/baileys) di package.json
- Membuat WhatsApp service di mini-services/whatsapp-service/
- Membuat package.json untuk WhatsApp service dengan dependencies express, cors, zod
- Membuat index.ts sebagai main file WhatsApp service dengan fitur lengkap:
  - create() function untuk initialize WhatsApp instance
  - sendWhatsAppMessage() function untuk kirim pesan single
  - sendAttendanceNotification() function untuk kirim notifikasi absensi
  - sendEmployeeNotification() function untuk kirim notifikasi karyawan
  - sendBulkNotifications() function untuk kirim bulk messages
  - getConnectionStatus() function untuk check status koneksi
  - getCurrentQR() function untuk get QR code
  - disconnectWhatsApp() function untuk disconnect
  - healthCheck() function untuk health check
- API server pada port 3001 dengan endpoints:
  - GET /health - Health check service
  - GET /status - Status koneksi WhatsApp
  - GET /qr - Get QR code untuk scan
  - POST /send - Send message (support attendance dan custom)
  - POST /bulk-send - Send bulk messages
  - POST /disconnect - Disconnect WhatsApp
  - POST /reconnect - Reconnect WhatsApp
- Mengupdate API attendance (/src/app/api/attendance/route.ts) untuk:
  - Menambahkan function sendWhatsAppNotification()
  - Memanggil WhatsApp service setelah check-in berhasil
  - Memanggil WhatsApp service setelah check-out berhasil
  - Validasi WHATSAPP_ENABLED environment variable
  - Mengambil nomor telepon karyawan dari database
  - Mengirim notifikasi dengan format yang informatif:
    * Check-in: "Berhasil Check-In" dengan emoji ✅
    * Check-out: "Berhasil Check-Out" dengan ucapan terima kasih
- Mengupdate .env.example untuk menambahkan:
  - WHATSAPP_ENABLED="false" (default disabled)
  - WHATSAPP_USERNAME, WHATSAPP_PASSWORD, WHATSAPP_SERVER, WHATSAPP_SERVER_PORT
  - WHATSAPP_PORT=3001 untuk WhatsApp service
- Mengupdate DATABASE.md untuk menambahkan dokumentasi lengkap:
  - Fitur notifikasi WhatsApp
  - Format pesan check-in dan check-out
  - Cara setup Baileys
  - Cara setup WhatsApp Business API
  - Panduan troubleshooting
  - Best practices untuk WhatsApp notifications
- Mengupdate README-ABSENSI.md dengan:
  - Version v2.1
  - Fitur utama: WhatsApp Notifications
  - Format pesan yang detail dengan contoh
  - API endpoints baru untuk WhatsApp service
  - Dependencies yang ditambahkan
  - Struktur project yang update
  - Cara kerja notifikasi WhatsApp

Produced Artifacts:
- mini-services/whatsapp-service/index.ts
- mini-services/whatsapp-service/package.json
- Updated: src/app/api/attendance/route.ts
- Updated: .env.example
- Updated: DATABASE.md
- Updated: README-ABSENSI.md

Stage Summary:
- WhatsApp notification service berhasil dibuat dengan Baileys
- API attendance di-integrasikan dengan WhatsApp notification
- Documentation lengkap dibuat untuk setup dan troubleshooting
- Format pesan WhatsApp yang informatif dengan emoji
- Environment variables ditambahkan untuk konfigurasi
- Project berhasil di-push ke GitHub

Fitur WhatsApp:
- Notifikasi otomatis saat check-in berhasil
- Notifikasi otomatis saat check-out berhasil
- Format pesan yang informatif dan friendly
- Support untuk multi-device karyawan
- Health check endpoint untuk monitoring
- Graceful shutdown dan reconnection untuk WhatsApp service

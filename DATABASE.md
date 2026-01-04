# Database Configuration

Sistem absensi karyawan mendukung dua database: **SQLite** (default) dan **MySQL**.

## Database Options

### SQLite (Default)
- ✅ Mudah setup - tidak perlu install database server
- ✅ File-based database
- ✅ Cocok untuk development dan small projects
- ✅ Database file: `db/custom.db`

### MySQL
- ✅ Performa lebih baik untuk data yang besar
- ✅ Cocok untuk production
- ✅ Mendukung concurrent connections
- ✅ Database server yang lebih powerful

## Setup SQLite (Default)

```bash
# .env file
DATABASE_URL="file:./db/custom.db"
```

## Setup MySQL

### 1. Install MySQL Server

Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

macOS (Homebrew):
```bash
brew install mysql
brew services start mysql
```

Windows:
Download dari: https://dev.mysql.com/downloads/mysql/

### 2. Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE absensi_karyawan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'absensi_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON absensi_karyawan.* TO 'absensi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Install MySQL Client Library

```bash
npm install mysql2
```

### 4. Configure .env

```bash
# .env file
DATABASE_URL="mysql://absensi_user:your_password@localhost:3306/absensi_karyawan"
```

## Prisma Schema Configuration

Schema Prisma telah di-config untuk support kedua database:

### SQLite Schema
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### MySQL Schema
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## Migration antar Database

### Dari SQLite ke MySQL

1. Export data dari SQLite:
```bash
npm run db:export
```

2. Configure MySQL connection di .env:
```bash
DATABASE_URL="mysql://absensi_user:password@localhost:3306/absensi_karyawan"
```

3. Import data ke MySQL:
```bash
npm run db:import
```

### Dari MySQL ke SQLite

1. Export data dari MySQL:
```bash
npm run db:export
```

2. Configure SQLite connection di .env:
```bash
DATABASE_URL="file:./db/custom.db"
```

3. Import data ke SQLite:
```bash
npm run db:import
```

## Commands

```bash
# Push schema ke database (menggunakan provider yang aktif)
npm run db:push

# Generate Prisma client
npm run db:generate

# Create migration
npm run db:migrate

# Reset database
npm run db:reset
```

## Troubleshooting

### SQLite: "database is locked"
- Pastikan tidak ada proses lain yang sedang mengakses database
- Hapus file `.lock` jika ada

### MySQL: "Connection refused"
- Pastikan MySQL server berjalan:
  ```bash
  sudo service mysql status  # Linux
  brew services list | grep mysql  # macOS
  ```
- Cek port default 3306

### MySQL: "Access denied"
- Pastikan credentials di .env benar
- Cek privileges user database

## Production Recommendations

### Untuk Production, gunakan MySQL karena:

1. **Performa lebih baik** - Mendukung concurrent connections
2. **Scalability** - Bisa handle data yang besar
3. **Backup tools** - Lebih banyak tools untuk backup MySQL
4. **Monitoring** - Tools monitoring yang lebih lengkap
5. **Replication** - Mendukung master-slave replication

### Hosting Options

MySQL hosting:
- AWS RDS
- Google Cloud SQL
- DigitalOcean Managed Database
- Heroku Postgres (migrate ke Postgres)
- PlanetScale (MySQL serverless)

## Environment Variables

```bash
# .env.local untuk development
DATABASE_URL="file:./db/custom.db"

# .env.production untuk production dengan MySQL
DATABASE_URL="mysql://username:password@host:port/database_name"

# Opsional: Node environment
NODE_ENV="development"  # atau "production"
```

## Security

### Best Practices:

1. ✅ Jangan commit `.env` file ke git
2. ✅ Gunakan password yang kuat
3. ✅ Limit user privileges database
4. ✅ Enable SSL untuk production MySQL
5. ✅ Regular backup database
6. ✅ Gunakan connection string yang aman

### Connection String dengan SSL (MySQL Production):

```bash
DATABASE_URL="mysql://username:password@host:3306/database_name?sslmode=require"
```

## 📱 WhatsApp Notifications

### Fitur
- ✅ Notifikasi otomatis saat check-in berhasil
- ✅ Notifikasi otomatis saat check-out berhasil
- ✅ Format pesan yang informatif
- ✅ Format waktu yang jelas (Indonesia)
- ✅ Emoji untuk visual yang lebih baik
- ✅ Suport multi-device karyawan

### Format Pesan

**Check-In:**
```
✅ *Berhasil Check-In*
👤 *Karyawan:* [Nama Karyawan]
⏰ *Waktu:* [HH:MM]
📅 *Tanggal:* [DD Month YYYY]

Selamat bekerja! Semoga hari yang produktif. 🌟
```

**Check-Out:**
```
✅ *Berhasil Check-Out*
👤 *Karyawan:* [Nama Karyawan]
⏰ *Waktu:* [HH:MM]
📅 *Tanggal:* [DD Month YYYY]

Terima kasih atas kerja hari ini! Sampai jumpa besok. 🙏
```

### Konfigurasi

#### 1. Setup Environment Variables

`.env` file:
```bash
# Enable WhatsApp notifications
WHATSAPP_ENABLED="true"

# WhatsApp Business API Configuration (Baileys)
WHATSAPP_USERNAME="your_username"
WHATSAPP_PASSWORD="your_password"
WHATSAPP_SERVER="wa.gw.msg"
WHATSAPP_SERVER_PORT="443"

# WhatsApp Service Port
WHATSAPP_PORT=3001
```

### Setup Baileys

#### 1. Install Baileys
Baileys adalah library Node.js untuk mengirim pesan WhatsApp.

```bash
cd mini-services/whatsapp-service
npm install
```

#### 2. Create WhatsApp Business Account

1. Buka [WhatsApp Business](https://business.whatsapp.com/)
2. Register atau login dengan nomor telepon yang akan digunakan
3. Link nomor ke WhatsApp Business API
4. Gunakan nomor tersebut di sistem

#### 3. Get Credentials

Dari dashboard WhatsApp Business API:
- **API Key** (Phone Number ID)
- **Server URL** (biasanya: wa.gw.msg)
- Port (biasanya: 443 untuk HTTPS)

#### 4. Update Environment

```bash
# .env file
WHATSAPP_ENABLED="true"
WHATSAPP_USERNAME="YOUR_PHONE_NUMBER_ID"
WHATSAPP_PASSWORD="YOUR_PASSWORD"
WHATSAPP_SERVER="wa.gw.msg"
WHATSAPP_SERVER_PORT="443"
WHATSAPP_PORT=3001
```

#### 5. Start WhatsApp Service

```bash
cd mini-services/whatsapp-service
npm start
```

Service akan berjalan di `http://localhost:3001`

#### 6. Verify Connection

Check API health:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "service": "whatsapp-service",
  "status": "active",
  "connectionStatus": {
    "connected": true
  },
  "port": 3001,
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

### WhatsApp Service API Endpoints

Service WhatsApp memiliki API endpoints sendiri untuk testing:

- `GET /health` - Health check service
- `GET /status` - Status koneksi WhatsApp
- `GET /qr` - Get QR code untuk scan
- `POST /send` - Kirim pesan WhatsApp
  - Body: `{ phone, message }`
- `POST /disconnect` - Disconnect WhatsApp
- `POST /reconnect` - Reconnect WhatsApp

### Format Nomor Telepon

Nomor telepon di database harus sesuai format yang diterima WhatsApp:

**Format yang benar:**
- `628123456789` (dengan country code Indonesia)
- `08123456789` (tanpa country code, akan ditambah 62 otomatis)

**Contoh di database:**
```
phone: "628123456789"  // Indonesia (+62)
phone: "08123456789"  // Akan otomatis menjadi 628123456789
```

### Cara Kerja

1. **Karyawan Scan QR Code**
   - Sistem mencatat check-in/check-out di database
   - System mengambil nomor telepon karyawan
   - System mengirim request ke WhatsApp service

2. **WhatsApp Service Menerima Request**
   - WhatsApp service mengirim pesan ke nomor karyawan
   - Menggunakan format pesan yang telah ditentukan
   - Log pengiriman di console

3. **Karyawan Menerima Notifikasi**
   - Karyawan menerima pesan WhatsApp otomatis
   - Pesan berisi informasi absensi (check-in/out, waktu, tanggal)
   - Emoji dan format yang mudah dibaca

### Troubleshooting WhatsApp

#### 1. Nomor Telepon Tidak Terdaftar

**Masalah:** "Nomor telepon tidak terdaftar di WhatsApp"

**Solusi:**
- Pastikan nomor telepon di format yang benar (dengan country code)
- Pastikan nomor telepon sudah terdaftar di WhatsApp
- Cek bahwa nomor tersebut aktif dan bisa menerima pesan

#### 2. WhatsApp Service Tidak Terhubung

**Masalah:** Status connection tidak connected

**Solusi:**
- Cek apakah WhatsApp service berjalan:
  ```bash
  curl http://localhost:3001/health
  ```
- Cek environment variables di .env
- Restart WhatsApp service:
  ```bash
  cd mini-services/whatsapp-service
  npm start
  ```

#### 3. Pesan Tidak Terkirim

**Masalah:** Notifikasi tidak diterima

**Solusi:**
- Cek logs WhatsApp service:
  ```bash
  npm start  # Pastikan logs tidak ada error
  ```
- Cek apakah WHATSAPP_ENABLED="true" di .env
- Cek apakah credentials WhatsApp Business API benar
- Cek apakah koneksi internet stabil

#### 4. WhatsApp Business API Limit

**Masalah:** "Gagal mengirim pesan WhatsApp" karena rate limit

**Solusi:**
- Gunakan WhatsApp Business API dengan rate limit yang lebih tinggi
- Tambah delay antar pengiriman (sudah ditambahkan 100ms)
- Gunakan multi-device untuk load balancing

### Testing WhatsApp Notifications

#### Test Send Message

```bash
curl -X POST http://localhost:3001/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "628123456789",
    "message": "Test pesan dari sistem absensi"
  }'
```

#### Test Attendance Notification

Setelah karyawan melakukan check-in, pesan akan otomatis dikirim. Cek di console WhatsApp service:
```
WhatsApp notification (check-in) sent to 628123456789: { success: true, ... }
```

### Best Practices

1. ✅ **Format Pesan Konsisten**
   - Gunakan emoji yang sama untuk check-in dan check-out
   - Format waktu yang konsisten (HH:MM)
   - Format tanggal yang konsisten (DD Month YYYY)

2. ✅ **Teks yang Jelas**
   - Gunakan bahasa Indonesia yang mudah dimengerti
   - Avoid technical terms
   - Gunakan friendly messages

3. ✅ **Error Handling**
   - Log semua error di console
   - Tidak crash service jika gagal kirim
   - Retry mechanism (opsional)

4. ✅ **Performance**
   - Gunakan connection pool untuk WhatsApp service
   - Cache QR code jika perlu
   - Rate limiting untuk menghindari rate limit WhatsApp

5. ✅ **Security**
   - Jangan log password di console
   - Gunakan environment variables untuk credentials
   - Validate nomor telepon sebelum mengirim
   - Sanitasi input sebelum mengirim

### Multiple Devices

Jika menggunakan multiple WhatsApp business numbers:

1. Buat multiple instances di WhatsApp service
2. Load balance antar instances
3. Distribusi karyawan antar devices
4. Monitor semua instances

Contoh konfigurasi untuk 3 devices:
```bash
# .env
WHATSAPP_ENABLED="true"
WHATSAPP_DEVICE_1="628123456789"
WHATSAPP_DEVICE_2="628234567890"
WHATSAPP_DEVICE_3="6283456789012"
```


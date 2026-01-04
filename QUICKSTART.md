# Quick Start Guide - Ubuntu 22

## 🚀 Cara Cepat Setup Sistem Absensi Karyawan di Ubuntu 22

### Prerequisites
- Ubuntu 22.04 LTS
- Akses root atau sudo privileges
- Akses internet

### Langkah 1: Download Setup Script

```bash
# Clone repository (atau download manual)
git clone https://github.com/mauljasmay/absensi-karyawan.git
cd absensi-karyawan
```

### Langkah 2: Jalankan Setup Script

```bash
# Make script executable
chmod +x setup-ubuntu.sh

# Jalankan setup script
sudo ./setup-ubuntu.sh
```

### Apa yang Dilakukan oleh Setup Script?

Setup script akan otomatis melakukan:

1. ✅ Update system packages
2. ✅ Install Node.js 20.x LTS
3. ✅ Install NPM & PM2
4. ✅ Install SQLite & MySQL dependencies
5. ✅ Install build tools (git, curl, python, imagemagick)
6. ✅ Setup project directory (/opt/absensi-karyawan)
7. ✅ Clone project dari GitHub
8. ✅ Install project dependencies
9. ✅ Setup environment file (.env)
10. ✅ Setup database (push schema)
11. ✅ Build project untuk production
12. ✅ Setup PM2 process manager
13. ✅ Start Next.js app
14. ✅ Setup WhatsApp service
15. ✅ Configure firewall (UFW)
16. ✅ Setup Nginx reverse proxy (optional)
17. ✅ Setup log rotation
18. ✅ Create backup script & cronjob

### Langkah 3: Akses Aplikasi

Setelah setup selesai, aplikasi dapat diakses di:

```
http://IP_SERVER
```

Default login:
- **Admin**: Username `admin`, Password `admin123`
- **Karyawan**: Email `employee@example.com`, Password `employee123`

### Langkah 4: Konfigurasi Tambahan

#### 1. Login sebagai Admin

```
http://IP_SERVER/admin/login
Username: admin
Password: admin123
```

#### 2. Buka Pengaturan Sistem

```
http://IP_SERVER/admin/settings
```

#### 3. Konfigurasi Sistem

- **Informasi Perusahaan**: Masukkan data perusahaan
- **Kebijakan Absensi**: Atur jam kerja dan batas terlambat
- **Notifikasi WhatsApp**:
  - Enable WhatsApp notifications
  - Masukkan URL service WhatsApp (default: http://localhost:3001)
  - Enable auto-update untuk restart service otomatis
- **Konfigurasi QR Code**: Setup auto-generate QR code

#### 4. Tambah Karyawan

```
http://IP_SERVER/admin/employees
```

- Klik "Tambah Karyawan"
- Isi data lengkap:
  - Nomor karyawan
  - Nama lengkap
  - Email
  - Nomor telepon (untuk WhatsApp notifications)
  - Departemen
  - Posisi
  - Password
  - Tanggal gajian (format: YYYY-MM-DD)
  - No. rekening (untuk gaji)
  - Nama bank
  - Upload foto profil (opsional)

#### 5. Generate QR Code

```
http://IP_SERVER/admin/qr-code
```

- Generate QR code untuk hari ini
- QR code akan berubah setiap hari

### Langkah 5: Setup WhatsApp Notifications (Opsional)

#### Install WhatsApp Business API

1. Buka [WhatsApp Business](https://business.whatsapp.com/)
2. Register/Login dengan nomor telepon
3. Menu Settings → Tools → WhatsApp Business API
4. Link nomor ke API
5. Copy credentials:
   - Phone Number ID
   - API Token

#### Konfigurasi WhatsApp Service

Di file `.env` di server:
```bash
# Edit environment file
nano /opt/absensi-karyawan/.env
```

Tambahkan:
```bash
WHATSAPP_ENABLED="true"
WHATSAPP_USERNAME="YOUR_PHONE_NUMBER_ID"
WHATSAPP_PASSWORD="YOUR_API_TOKEN"
WHATSAPP_SERVER="wa.gw.msg"
WHATSAPP_SERVER_PORT="443"
```

#### Restart WhatsApp Service

```bash
cd /opt/absensi-karyawan
pm2 restart whatsapp-service
```

### PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs absensi-app
pm2 logs whatsapp-service

# Restart application
pm2 restart absensi-app

# Restart WhatsApp service
pm2 restart whatsapp-service

# Stop application
pm2 stop absensi-app

# Start application
pm2 start absensi-app
```

### Backup

```bash
# Manual backup
/opt/absensi-karyawan/backup.sh

# Backup terjadwal (setiap hari jam 3 AM)
# Cek cronjob: crontab -l
```

### Monitoring

```bash
# Cek status PM2
pm2 status

# Cek resource usage
htop

# Cek disk space
df -h

# Cek logs
tail -f /var/log/absensi-karyawan/*.log
```

### Troubleshooting

#### Aplikasi tidak bisa diakses

```bash
# Cek status PM2
pm2 status

# Restart aplikasi
pm2 restart absensi-app

# Cek logs untuk error
pm2 logs absensi-app --lines 50
```

#### WhatsApp notifications tidak jalan

```bash
# Cek status WhatsApp service
pm2 status whatsapp-service

# Restart WhatsApp service
pm2 restart whatsapp-service

# Cek logs WhatsApp
pm2 logs whatsapp-service --lines 50
```

#### Database error

```bash
# Push schema ke database
cd /opt/absensi-karyawan
npm run db:push

# Reset database (WARNING: akan menghapus semua data)
npm run db:reset
```

#### Build error

```bash
# Clean dan rebuild
rm -rf .next node_modules
npm install
npm run build

# Restart aplikasi
pm2 restart absensi-app
```

### Security Best Practices

1. **Firewall**:
   ```bash
   # Cek status firewall
   ufw status

   # Hanya allow port yang perlu
   ufw allow 22/tcp  # SSH
   ufw allow 80/tcp  # HTTP
   ufw allow 443/tcp # HTTPS (jika menggunakan SSL)
   ```

2. **Update Regular**:
   ```bash
   # Update system
   apt-get update
   apt-get upgrade

   # Update project
   cd /opt/absensi-karyawan
   git pull
   npm install
   pm2 restart all
   ```

3. **Backup Routine**:
   ```bash
   # Setup backup otomatis
   # Script backup sudah di-setup di cronjob
   # Check: crontab -l
   ```

4. **Monitor Logs**:
   ```bash
   # Check error logs
   tail -f /var/log/absensi-karyawan/*.log | grep -i error

   # PM2 logs
   pm2 logs absensi-app --err-only
   ```

### Production Deployment

Untuk production, disarankan:

1. ✅ **Use MySQL** instead of SQLite untuk performa yang lebih baik
2. ✅ **Enable SSL/HTTPS** dengan Let's Encrypt atau Cloudflare
3. ✅ **Use Nginx reverse proxy** untuk production
4. ✅ **Monitor dengan tools** seperti PM2 Monit, Grafana
5. ✅ **Regular backup** ke cloud storage (S3, Google Drive, dll)
6. ✅ **Limit file upload size** untuk security
7. ✅ **Use rate limiting** untuk API endpoints
8. ✅ **Enable HTTPS** untuk semua endpoints
9. ✅ **Secure environment variables** di .env (jangan commit ke git)
10. ✅ **Use strong passwords** dan enable 2FA

### Update Project

```bash
# Go to project directory
cd /opt/absensi-karyawan

# Pull latest changes
git pull origin master

# Update dependencies
npm install

# Build project
npm run build

# Restart aplikasi
pm2 restart absensi-app

# Jika ada perubahan database
npm run db:push
```

### Quick Reference

| Command | Deskripsi |
|---------|-----------|
| `pm2 status` | Cek status semua apps |
| `pm2 logs absensi-app` | View logs Next.js app |
| `pm2 logs whatsapp-service` | View logs WhatsApp service |
| `pm2 restart absensi-app` | Restart Next.js app |
| `pm2 restart whatsapp-service` | Restart WhatsApp service |
| `/opt/absensi-karyawan/backup.sh` | Manual backup |
| `crontab -l` | Lihat cronjobs |
| `tail -f /var/log/absensi-karyawan/*.log` | View real-time logs |
| `cd /opt/absensi-karyawan` | Go to project directory |
| `npm run build` | Build untuk production |
| `npm run db:push` | Push schema ke database |

### Support

Untuk dokumentasi lengkap, lihat:

- [README-ABSENSI.md](./README-ABSENSI.md) - Dokumentasi lengkap fitur
- [DATABASE.md](./DATABASE.md) - Panduan database dan WhatsApp
- [STRUKTUR-HALAMAN.md](./STRUKTUR-HALAMAN.md) - Struktur halaman detail
- [ENHANCEMENTS.md](./ENHANCEMENTS.md) - Log perubahan

### Version Info

- **Application Version**: 2.3.0
- **Baileys Version**: 7.0.0
- **Next.js Version**: 15.3.5
- **Node.js Version**: 20.x LTS
- **Database**: SQLite (default) atau MySQL (optional)

### Changelog v2.3.0

- ✅ Migrate ke Baileys v7.0.0
- ✅ Add auto-update WhatsApp di settings
- ✅ Add upload foto karyawan
- ✅ Add tanggal gajian, no rekening, nama bank
- ✅ Add sidebar menu untuk admin panel
- ✅ Add quick setup script untuk Ubuntu 22
- ✅ Integrasi sidebar ke semua admin pages
- ✅ Add PM2 process management
- ✅ Add Nginx reverse proxy (optional)
- ✅ Add log rotation
- ✅ Add backup script otomatis
- ✅ Add security configurations
- ✅ Fix semua bug di project

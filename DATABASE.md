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

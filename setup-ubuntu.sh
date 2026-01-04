#!/bin/bash

# ============================================================================
# QUICK SETUP SCRIPT FOR UBUNTU 22 - SISTEM ABSENSI KARYAWAN
# ============================================================================
# Script ini akan menginstall semua dependencies yang dibutuhkan
# dan menjalankan sistem absensi karyawan di Ubuntu 22
# ============================================================================

set -e  # Exit jika ada error

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fungsi untuk print color output
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_step() {
    echo -e "\n${GREEN}➤ Step $1: $2${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# ============================================================================
# CEK ROOT ACCESS
# ============================================================================
print_header "SISTEM ABSENSI KARYAWAN - QUICK SETUP"
echo -e "${YELLOW}Script ini harus dijalankan sebagai root${NC}"
echo ""

if [ "$EUID" -ne 0 ]; then
    print_error "Harap jalankan script ini sebagai root atau dengan sudo"
    exit 1
fi

# ============================================================================
# UPDATE SYSTEM
# ============================================================================
print_step "1" "Update System Packages"
apt-get update -y
apt-get upgrade -y
print_success "System packages updated"

# ============================================================================
# INSTALL NODE.JS
# ============================================================================
print_step "2" "Install Node.js 20.x LTS"
if ! command -v node &> /dev/null; then
    print_info "Installing Node.js..."

    # Install dependencies
    apt-get install -y curl gnupg

    # Download dan install Node.js setup script
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

    # Install Node.js
    apt-get install -y nodejs

    print_success "Node.js installed"
    node -v
else
    print_success "Node.js already installed: $(node -v)"
fi

# ============================================================================
# INSTALL NPM & PM2
# ============================================================================
print_step "3" "Install NPM & PM2"
if ! command -v npm &> /dev/null; then
    apt-get install -y npm

    # Install PM2 untuk process management
    npm install -g pm2

    print_success "NPM & PM2 installed"
    npm -v
    pm2 -v
else
    print_success "NPM already installed: $(npm -v)"
fi

# ============================================================================
# INSTALL DATABASE DEPENDENCIES
# ============================================================================
print_step "4" "Install SQLite & MySQL Dependencies"
apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    mysql-server \
    mysql-client \
    libmysqlclient-dev

print_success "Database dependencies installed"

# ============================================================================
# INSTALL BUILD TOOLS
# ============================================================================
print_step "5" "Install Build Tools & Dependencies"
apt-get install -y \
    build-essential \
    git \
    curl \
    wget \
    python3 \
    python3-pip \
    imagemagick \
    ffmpeg

print_success "Build tools installed"

# ============================================================================
# CREATE PROJECT DIRECTORY
# ============================================================================
print_step "6" "Setup Project Directory"
PROJECT_DIR="/opt/absensi-karyawan"

if [ -d "$PROJECT_DIR" ]; then
    print_info "Project directory already exists: $PROJECT_DIR"
else
    mkdir -p "$PROJECT_DIR"
    print_success "Project directory created: $PROJECT_DIR"
fi

cd "$PROJECT_DIR"

# ============================================================================
# CLONE GIT REPOSITORY
# ============================================================================
print_step "7" "Clone Project from GitHub"
GIT_REPO="https://github.com/mauljasmay/absensi-karyawan.git"

if [ ! -d ".git" ]; then
    git clone "$GIT_REPO" .
    print_success "Project cloned from GitHub"
else
    print_info "Git repository already exists, pulling latest changes..."
    git pull
    print_success "Latest changes pulled"
fi

# ============================================================================
# INSTALL PROJECT DEPENDENCIES
# ============================================================================
print_step "8" "Install Project Dependencies (This may take a while...)"
if [ -f "package.json" ]; then
    npm install
    print_success "Project dependencies installed"
else
    print_error "package.json not found!"
    exit 1
fi

# ============================================================================
# SETUP ENVIRONMENT FILE
# ============================================================================
print_step "9" "Setup Environment File"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success ".env file created from .env.example"
    else
        print_info "Creating basic .env file..."
        cat > .env << 'EOF'
# Database Configuration
DATABASE_URL="file:./db/custom.db"

# Application Configuration
PORT=3000
NODE_ENV="production"

# WhatsApp Configuration
WHATSAPP_ENABLED="false"
WHATSAPP_PORT=3001
WHATSAPP_BASE_URL="https://wa.me"
EOF
        print_success ".env file created"
    fi
else
    print_info ".env file already exists"
fi

# ============================================================================
# SETUP DATABASE
# ============================================================================
print_step "10" "Setup Database"
mkdir -p db

# Push schema ke database
npx prisma db push || npm run db:push

if [ -f "db/custom.db" ]; then
    print_success "Database setup complete"
    chmod 644 db/custom.db
else
    print_error "Database file not found!"
    exit 1
fi

# ============================================================================
# BUILD PROJECT
# ============================================================================
print_step "11" "Build Project for Production"
npm run build

if [ -d ".next" ]; then
    print_success "Project built successfully"
else
    print_error "Build failed!"
    exit 1
fi

# ============================================================================
# SETUP PM2
# ============================================================================
print_step "12" "Setup PM2 Process Manager"

# Stop existing process jika ada
pm2 stop absensi-app 2>/dev/null || true

# Start aplikasi dengan PM2
pm2 start npm --name "absensi-app" -- start

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup ubuntu -u root --hp /opt/absensi-karyawan

print_success "PM2 setup complete"
pm2 list

# ============================================================================
# START WHATSAPP SERVICE
# ============================================================================
print_step "13" "Setup WhatsApp Service"
cd mini-services/whatsapp-service

if [ -f "package.json" ]; then
    npm install
    print_success "WhatsApp service dependencies installed"
else
    print_error "WhatsApp service package.json not found!"
    exit 1
fi

# Start WhatsApp service dengan PM2
pm2 start npm --name "whatsapp-service" -- start -- ./mini-services/whatsapp-service

# Save PM2 process untuk WhatsApp
pm2 save

print_success "WhatsApp service started with PM2"

# Kembali ke project root
cd "$PROJECT_DIR"

# ============================================================================
# CONFIGURE FIREWALL (UFW)
# ============================================================================
print_step "14" "Configure Firewall"
apt-get install -y ufw

# Allow SSH
ufw allow OpenSSH

# Allow aplikasi ports
ufw allow 3000/tcp    # Next.js App
ufw allow 3001/tcp    # WhatsApp Service

# Enable firewall
ufw --force enable

print_success "Firewall configured"

# ============================================================================
# SETUP NGINX REVERSE PROXY (OPTIONAL)
# ============================================================================
print_step "15" "Setup Nginx Reverse Proxy (Optional)"
read -p "${YELLOW}Install Nginx reverse proxy? (y/n): ${NC}" INSTALL_NGINX

if [ "$INSTALL_NGINX" = "y" ] || [ "$INSTALL_NGINX" = "Y" ]; then
    apt-get install -y nginx

    # Setup Nginx configuration
    cat > /etc/nginx/sites-available/absensi-karyawan << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    # Enable site
    ln -sf /etc/nginx/sites-available/absensi-karyawan /etc/nginx/sites-enabled/

    # Test dan reload Nginx
    nginx -t
    systemctl reload nginx

    print_success "Nginx reverse proxy configured"
else
    print_info "Nginx setup skipped"
fi

# ============================================================================
# CREATE LOG ROTATION
# ============================================================================
print_step "16" "Setup Log Rotation"
cat > /etc/logrotate.d/absensi-karyawan << 'EOF'
/opt/absensi-karyawan/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF

print_success "Log rotation configured"

# ============================================================================
# SETUP BACKUP SCRIPT
# ============================================================================
print_step "17" "Setup Backup Script"
cat > /opt/absensi-karyawan/backup.sh << 'EOF'
#!/bin/bash

# Backup Script
DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backup/absensi"
PROJECT_DIR="/opt/absensi-karyawan"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
cp "$PROJECT_DIR/db/custom.db" "$BACKUP_DIR/custom.db.$DATE"

# Backup uploads
tar -czf "$BACKUP_DIR/uploads.$DATE.tar.gz" "$PROJECT_DIR/public/uploads"

# Backup environment files
cp "$PROJECT_DIR/.env" "$BACKUP_DIR/.env.$DATE"

# Delete old backups (keep last 7 days)
find "$BACKUP_DIR" -type f -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /opt/absensi-karyawan/backup.sh

print_success "Backup script created"

# Add backup ke cronjob (setiap hari jam 3 pagi)
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/absensi-karyawan/backup.sh") | crontab -

print_success "Backup cronjob added (runs daily at 3 AM)"

# ============================================================================
# CREATE STARTUP SCRIPT
# ============================================================================
print_step "18" "Create Startup Script"
cat > /opt/absensi-karyawan/start-all.sh << 'EOF'
#!/bin/bash

# Start semua services
cd /opt/absensi-karyawan

# Start Next.js app
pm2 start absensi-app

# Start WhatsApp service
cd mini-services/whatsapp-service
pm2 start whatsapp-service

# Check status
pm2 status

echo "All services started!"
EOF

chmod +x /opt/absensi-karyawan/start-all.sh

print_success "Startup script created"

# ============================================================================
# FINAL SUMMARY
# ============================================================================
print_header "INSTALLATION COMPLETE!"

echo -e "${GREEN}✅ Setup Selesai!${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  SUMMARY${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}✓${NC} Node.js $(node -v) installed"
echo -e "${GREEN}✓${NC} NPM $(npm -v) installed"
echo -e "${GREEN}✓${NC} PM2 $(pm2 -v) installed"
echo -e "${GREEN}✓${NC} SQLite & MySQL dependencies installed"
echo -e "${GREEN}✓${NC} Build tools installed"
echo -e "${GREEN}✓${NC} Project cloned dari GitHub"
echo -e "${GREEN}✓${NC} Project dependencies installed"
echo -e "${GREEN}✓${NC} Database setup complete"
echo -e "${GREEN}✓${NC} Project built for production"
echo -e "${GREEN}✓${NC} PM2 configured"
echo -e "${GREEN}✓${NC} Firewall configured"
echo -e "${GREEN}✓${NC} Log rotation setup"
echo -e "${GREEN}✓${NC} Backup script created"
echo -e "${GREEN}✓${NC} Startup script created"

if [ "$INSTALL_NGINX" = "y" ] || [ "$INSTALL_NGINX" = "Y" ]; then
    echo -e "${GREEN}✓${NC} Nginx reverse proxy configured"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  ACCESS INFORMATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}🌐 Next.js App:${NC}"
echo -e "   URL: http://$(curl -s ifconfig.me || curl -s icanhazip.com)"
echo -e "   Port: 3000"
echo ""

echo -e "${GREEN}📱 WhatsApp Service:${NC}"
echo -e "   Port: 3001"
echo -e "   Status: Check dengan: pm2 status"
echo ""

echo -e "${GREEN}📁 Project Directory:${NC}"
echo -e "   Path: /opt/absensi-karyawan"
echo ""

echo -e "${GREEN}📊 PM2 Commands:${NC}"
echo -e "   View logs: pm2 logs absensi-app"
echo -e "   Restart: pm2 restart absensi-app"
echo -e "   Stop: pm2 stop absensi-app"
echo -e "   Status: pm2 status"
echo ""

echo -e "${GREEN}💾 Backup:${NC}"
echo -e "   Manual: /opt/absensi-karyawan/backup.sh"
echo -e "   Schedule: Daily at 3 AM"
echo -e "   Location: /backup/absensi/"
echo ""

echo -e "${GREEN}🔧 Configuration Files:${NC}"
echo -e "   Environment: /opt/absensi-karyawan/.env"
echo -e "   Database: /opt/absensi-karyawan/db/custom.db"
echo -e "   Logs: /var/log/absensi-karyawan/"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  NEXT STEPS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}1.${NC} Akses aplikasi di browser"
echo -e "${YELLOW}2.${NC} Login sebagai admin (username: admin, password: admin123)"
echo -e "${YELLOW}3.${NC} Buka halaman /admin/settings untuk konfigurasi sistem"
echo -e "${YELLOW}4.${NC} Tambah karyawan dan upload foto profil"
echo -e "${YELLOW}5.${NC} Generate QR code untuk absensi hari ini"
echo -e "${YELLOW}6.${NC} Jika ingin menggunakan notifikasi WhatsApp:"
echo -e "   - Buka /admin/settings"
echo -e "   - Enable WhatsApp notifications"
echo -e "   - Setup WhatsApp Business API credentials"
echo -e "   - Start WhatsApp service: cd mini-services/whatsapp-service && npm start"
echo ""

echo -e "${GREEN}🎉 Sistem absensi karyawan siap digunakan!${NC}"
echo ""

# ============================================================================
# DONE
# ============================================================================

# Deployment Guide for Farm-Secure

This guide covers deploying Farm-Secure to production environments.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates obtained
- [ ] Domain names configured
- [ ] Backup strategy in place
- [ ] Monitoring tools set up

## 🚀 Deployment Options

### Option 1: Traditional VPS (DigitalOcean, AWS EC2, etc.)

#### Prerequisites
- Ubuntu 20.04+ or similar Linux distribution
- Root or sudo access
- Domain name pointed to server IP

#### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Redis (optional)
sudo apt install -y redis-server
```

#### Step 2: Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE farmsecure;
CREATE USER farmsecure_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE farmsecure TO farmsecure_user;
\q
```

#### Step 3: Application Deployment

```bash
# Create application directory
sudo mkdir -p /var/www/farm-secure
sudo chown -R $USER:$USER /var/www/farm-secure

# Clone repository
cd /var/www/farm-secure
git clone <your-repo-url> .

# Backend setup
cd backend
npm install --production
cp .env.example .env
# Edit .env with production values
nano .env

# Run migrations
npx prisma generate
npx prisma migrate deploy

# Build backend
npm run build

# Frontend setup
cd ../frontend
npm install
# Create production .env
echo "VITE_API_URL=https://api.yourdomain.com/api/v1" > .env
npm run build
```

#### Step 4: Configure PM2

```bash
# Start backend with PM2
cd /var/www/farm-secure/backend
pm2 start dist/server.js --name farm-secure-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided
```

#### Step 5: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/farm-secure
```

Add the following configuration:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/farm-secure/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/farm-secure /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

### Option 2: Docker Deployment

#### Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: farmsecure
      POSTGRES_USER: farmsecure_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - farm-secure-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    networks:
      - farm-secure-network
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://farmsecure_user:${DB_PASSWORD}@postgres:5432/farmsecure
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - postgres
      - redis
    networks:
      - farm-secure-network
    restart: unless-stopped
    ports:
      - "5000:5000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${API_URL}
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - farm-secure-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  farm-secure-network:
    driver: bridge
```

#### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
```

#### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Frontend Nginx Config

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

#### Deploy with Docker

```bash
# Create .env file
cat > .env << EOF
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
API_URL=https://api.yourdomain.com/api/v1
EOF

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Cloud Platforms (Heroku, Railway, Render)

#### Heroku Deployment

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create farm-secure-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Add Redis
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set FRONTEND_URL=https://farm-secure.netlify.app

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
```

#### Frontend on Netlify/Vercel

**Netlify:**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables: `VITE_API_URL`

**Vercel:**
1. Import project from GitHub
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables: `VITE_API_URL`

## 🔧 Environment Variables (Production)

### Backend

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database
REDIS_URL=redis://host:6379
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=<another-strong-secret>
REFRESH_TOKEN_EXPIRES_IN=30d
FRONTEND_URL=https://yourdomain.com
OPENWEATHER_API_KEY=<your-key>
GOOGLE_MAPS_API_KEY=<your-key>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASS=<app-password>
EMAIL_FROM=noreply@yourdomain.com
```

### Frontend

```env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

## 📊 Monitoring & Logging

### PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs farm-secure-api

# Monitor resources
pm2 monit
```

### Application Logging

Consider integrating:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Datadog** or **New Relic** for APM

### Database Backups

```bash
# Automated daily backups
sudo crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * pg_dump -U farmsecure_user farmsecure > /backups/farmsecure_$(date +\%Y\%m\%d).sql
```

## 🔒 Security Checklist

- [ ] HTTPS enabled (SSL certificates)
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] Firewall configured (UFW)
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] SQL injection protection (Prisma)
- [ ] XSS protection (React)
- [ ] CSRF protection
- [ ] Regular security updates
- [ ] Backup strategy implemented

## 🚨 Troubleshooting

### Backend won't start
- Check PM2 logs: `pm2 logs`
- Verify database connection
- Check environment variables
- Ensure migrations ran successfully

### Frontend shows blank page
- Check browser console for errors
- Verify API URL is correct
- Check CORS configuration
- Ensure build was successful

### Database connection issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists
- Check firewall rules

## 📈 Performance Optimization

### Backend
- Enable Redis caching
- Use connection pooling
- Optimize database queries
- Enable gzip compression
- Use CDN for static assets

### Frontend
- Code splitting
- Lazy loading routes
- Image optimization
- Service worker for caching
- Bundle size optimization

## 🔄 Updates & Maintenance

```bash
# Pull latest changes
cd /var/www/farm-secure
git pull origin main

# Update backend
cd backend
npm install
npm run build
pm2 restart farm-secure-api

# Update frontend
cd ../frontend
npm install
npm run build
```

## 📞 Support

For deployment issues:
- Check logs first
- Review documentation
- Open GitHub issue
- Contact support team

---

**Good luck with your deployment! 🚀**

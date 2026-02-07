# 🚀 LogerClaw Deployment Guide

**Production deployment guide for hackathon demo and beyond.**

---

## 📋 Pre-Deployment Checklist

- [ ] Code compiled successfully (`npm run build`)
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Solana wallet funded (devnet)
- [ ] VPS accessible via SSH
- [ ] Domain pointed to VPS (optional)

---

## 🖥️ VPS Requirements

### Minimum Specs
- **CPU**: 2 cores
- **RAM**: 2GB
- **Storage**: 20GB SSD
- **OS**: Ubuntu 20.04+ / Debian 11+
- **Network**: Public IP, Port 3000 open

### Recommended Providers
- Hostinger VPS
- Digital Ocean
- Linode
- AWS Lightsail

---

## 🔧 Step-by-Step Deployment

### 1. Prepare VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install build tools
sudo apt install -y build-essential git

# Verify installation
node --version  # Should be 18+
npm --version
```

### 2. Setup Application

```bash
# Clone repository
cd ~
git clone <your-repo-url> agent-hackathon
cd agent-hackathon

# Install dependencies
npm install

# Build TypeScript
npm run build

# Verify build
ls -la dist/
```

### 3. Configure Environment

```bash
# Create .env file
cat > .env << 'EOF'
PORT=3000
NODE_ENV=production
WALLET_KEYPAIR_PATH=./keys/logerclaw-agent.json
ALLOWED_ORIGINS=*
EOF

# Secure permissions
chmod 600 .env
```

### 4. Initialize Solana Wallet

```bash
# Create keys directory
mkdir -p keys
chmod 700 keys

# Run blockchain demo once to generate wallet
npm run blockchain

# Wallet will be created at keys/logerclaw-agent.json
# Note the public key for reference
```

### 5. Test Locally

```bash
# Start API server
npm run api

# In another terminal, test
curl http://localhost:3000/health

# Should return: {"status":"healthy",...}
```

### 6. Setup Process Manager (PM2)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start dist/api-server.js --name logerclaw-api

# Configure startup
pm2 startup
# Follow the command it outputs

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs logerclaw-api
```

### 7. Configure Firewall

```bash
# Allow SSH (important!)
sudo ufw allow 22/tcp

# Allow API port
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 8. Setup Nginx (Optional but Recommended)

```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/logerclaw

# Add this configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or VPS IP

    location / {
        proxy_pass http://localhost:3000;
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
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/logerclaw /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable on boot
sudo systemctl enable nginx
```

### 9. Setup SSL (Optional - Production)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

---

## 🔐 Security Hardening

### 1. Change Default SSH Port

```bash
sudo nano /etc/ssh/sshd_config
# Change: Port 22 → Port 2222
sudo systemctl restart sshd

# Update firewall
sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp
```

### 2. Disable Root Login

```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

### 3. Setup Fail2Ban

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. Secure Wallet Keys

```bash
# Ensure proper permissions
chmod 700 ~/agent-hackathon/keys
chmod 600 ~/agent-hackathon/keys/*.json

# Backup wallet (IMPORTANT!)
scp -P 22 root@your-vps:~/agent-hackathon/keys/logerclaw-agent.json ./backup-wallet.json
```

---

## 📊 Monitoring & Logs

### PM2 Commands

```bash
# View logs
pm2 logs logerclaw-api

# Monitor resources
pm2 monit

# Restart application
pm2 restart logerclaw-api

# Stop application
pm2 stop logerclaw-api

# View info
pm2 info logerclaw-api
```

### System Monitoring

```bash
# Check CPU/RAM usage
htop

# Check disk space
df -h

# Check network
netstat -tlnp | grep 3000

# View system logs
journalctl -u logerclaw-api -f
```

---

## 🔄 Updates & Maintenance

### Deploy New Version

```bash
# SSH to VPS
ssh your-vps

# Navigate to app
cd ~/agent-hackathon

# Pull latest code
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart with PM2
pm2 restart logerclaw-api

# Verify
curl http://localhost:3000/health
```

### Database Cleanup (if needed)

```bash
# Clear old logs
pm2 flush

# Clean npm cache
npm cache clean --force

# Remove old builds
rm -rf dist/ && npm run build
```

---

## 🧪 Testing Production Deployment

### Health Check

```bash
curl http://your-vps-ip:3000/health
```

Expected:
```json
{
  "status": "healthy",
  "service": "LogerClaw API",
  "blockchain": true
}
```

### Full Decision Test

```bash
curl -X POST http://your-vps-ip:3000/api/v1/decide \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"city": "Shanghai", "country": "China", "countryCode": "CN"},
    "destination": {"city": "Los Angeles", "country": "United States", "countryCode": "US"},
    "cargo": {"weight": 500, "volume": 2, "value": 25000, "type": "electronics"},
    "preferences": {"priority": "balanced", "anchorToBlockchain": false}
  }'
```

### UI Test

Open browser: `http://your-vps-ip:3000/`

---

## 🐛 Troubleshooting

### API Not Responding

```bash
# Check if process is running
pm2 status

# Check logs
pm2 logs logerclaw-api --lines 100

# Check port
netstat -tlnp | grep 3000

# Restart
pm2 restart logerclaw-api
```

### Out of Memory

```bash
# Check memory
free -h

# Increase PM2 memory limit
pm2 start dist/api-server.js --name logerclaw-api --max-memory-restart 500M

# Add swap (if needed)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Blockchain Connection Issues

```bash
# Check wallet
cat keys/logerclaw-agent.json

# Test Solana RPC
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '
  {"jsonrpc":"2.0","id":1,"method":"getHealth"}
'

# Run blockchain demo
npm run blockchain
```

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Or change port in .env
echo "PORT=3001" >> .env
pm2 restart logerclaw-api
```

---

## 📈 Performance Optimization

### Enable Caching

Add to `api-server.ts`:
```typescript
import cache from 'memory-cache';

// Cache middleware
app.use((req, res, next) => {
  const key = '__express__' + req.originalUrl;
  const cached = cache.get(key);
  if (cached) {
    return res.send(cached);
  }
  res.sendResponse = res.send;
  res.send = (body) => {
    cache.put(key, body, 60000); // 1 min
    res.sendResponse(body);
  };
  next();
});
```

### Enable Compression

```bash
npm install compression
```

```typescript
import compression from 'compression';
app.use(compression());
```

### Rate Limiting

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## ✅ Production Checklist

Before going live:

- [ ] Environment variables configured
- [ ] Firewall rules set
- [ ] PM2 startup configured
- [ ] Nginx configured (if using)
- [ ] SSL certificate installed (if using domain)
- [ ] Wallet backed up
- [ ] Health check passing
- [ ] Full API test passing
- [ ] UI accessible
- [ ] Logs being written
- [ ] Monitoring setup
- [ ] Documentation updated

---

## 📞 Support

- Check logs: `pm2 logs logerclaw-api`
- System status: `pm2 status`
- API health: `curl http://localhost:3000/health`
- Full docs: [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)

---

**🦞 LogerClaw - Production-ready deployment in 10 minutes.**

# 🚀 Deployment Guide

This guide covers multiple deployment options for the Universal Downloader application.

## 1. Railway.app (Recommended - Free & Easy)

### Setup Steps:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Connect Repository**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub
   - Select the `universal-downloader` repository

3. **Configure Environment**
   - Railway auto-detects Node.js
   - Set `PORT` to `3000` (or leave empty for auto)
   - No additional configuration needed

4. **Deploy**
   - Click "Deploy"
   - Railway builds and deploys automatically
   - Get your live URL in a few minutes

### Access Your App:
- Your app URL will be: `https://your-app-name.railway.app`
- Share this link to use the downloader!

---

## 2. Heroku

### Setup Steps:

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

4. **Set Buildpack**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Open App**
   ```bash
   heroku open
   ```

---

## 3. Render.com

### Setup Steps:

1. **Go to Render.com**
   - Visit https://render.com
   - Sign up with GitHub

2. **Create New Service**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repo

3. **Configure**
   - Name: `universal-downloader`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

---

## 4. Vercel (Limited - Node.js required)

### Setup Steps:

1. **Connect to Vercel**
   - Go to https://vercel.com
   - Import GitHub repository

2. **Configure**
   - Framework: None (Other)
   - Build Command: `npm install`

3. **Deploy**
   - Click Deploy
   - Get your live URL

---

## 5. Self-Hosted VPS

### Using DigitalOcean, Linode, AWS EC2, etc.

1. **SSH into Server**
   ```bash
   ssh root@your_server_ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/maffyjohn520-dev/universal-downloader.git
   cd universal-downloader
   ```

4. **Install Dependencies**
   ```bash
   npm install --production
   ```

5. **Setup PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "universal-downloader"
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx (Reverse Proxy)**
   ```bash
   sudo apt-get install nginx
   ```

7. **Configure Nginx**
   Create `/etc/nginx/sites-available/default`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Test and Restart Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Setup SSL (Let's Encrypt)**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 6. Docker

### Create Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Run:
```bash
docker build -t universal-downloader .
docker run -p 3000:3000 universal-downloader
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment mode |

---

## Monitoring & Maintenance

### Check Logs (Railway/Heroku)
- Platform-specific logging dashboard
- Useful for debugging issues

### Restart Application
- Railway: Automatic on git push
- Heroku: `heroku restart`
- PM2: `pm2 restart universal-downloader`

### Update Application
```bash
git pull origin main
npm install
# Redeploy (platform-specific)
```

---

## Performance Tips

1. **Enable Caching** - Configure browser caching in server.js
2. **Optimize Downloads** - Monitor disk space usage
3. **Rate Limiting** - Add rate limiting middleware (future)
4. **CDN** - Use Cloudflare for faster delivery

---

## Troubleshooting Deployment

### App crashes after deployment
- Check logs: `heroku logs --tail`
- Verify all dependencies: `npm list`
- Check `PORT` environment variable

### Downloads directory permission denied
- Ensure write permissions: `chmod 755 downloads/`
- Use `/tmp` for temporary files if on read-only filesystem

### Out of memory issues
- Increase RAM allocation
- Implement file streaming for large downloads

---

## Your Live Links

After deployment, you can access your app at:

- **Railway**: `https://your-app.railway.app`
- **Heroku**: `https://your-app.herokuapp.com`
- **Render**: `https://your-app.onrender.com`
- **Custom Domain**: `https://your-domain.com`

---

Need help? Check the [Issues](https://github.com/maffyjohn520-dev/universal-downloader/issues) or create a new one!
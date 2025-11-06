# Railway Deployment Guide

## ✅ Deployment Status

Your Django backend is successfully deployed on Railway!

## Current Setup

- **Backend**: Django REST API running on Railway
- **Frontend**: Should be deployed separately (Vercel/Netlify)
- **Database**: Currently using SQLite (upgrade to PostgreSQL recommended)

## 🔧 Required Environment Variables

Set these in your Railway project dashboard (Settings → Variables):

### Essential Variables
```bash
SECRET_KEY=<generate-a-secure-key>
DEBUG=False
ALLOWED_HOSTS=babs-production.up.railway.app,<your-custom-domain>
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,https://essentialsbybaabie.com
```

### Database (Recommended - Add PostgreSQL)
Currently using SQLite. For production, add PostgreSQL:

1. Go to your Railway project dashboard
2. Click "New" → "Database" → "Add PostgreSQL"
3. Railway will automatically set the `DATABASE_URL` variable
4. Redeploy your service

### Payment Integration (Optional)
```bash
PAYSTACK_SECRET_KEY=<your-paystack-secret-key>
PAYSTACK_PUBLIC_KEY=<your-paystack-public-key>
```

## 📦 Deployment Commands

```bash
# Deploy to Railway
railway up

# View logs
railway logs

# Open project in browser
railway open

# Run Django commands
railway run python back/manage.py <command>
```

## 🚀 Post-Deployment Steps

1. **Get your Railway URL**:
   - Check Railway dashboard or run `railway open`
   - URL format: `https://babs-production.up.railway.app`

2. **Update Frontend Configuration**:
   - Update `front/.env` with your Railway backend URL
   - Example: `VITE_API_URL=https://babs-production.up.railway.app`

3. **Configure CORS**:
   - Add your frontend URL to `CORS_ALLOWED_ORIGINS` in Railway variables
   - Include both production and preview URLs if using Vercel

4. **Create Admin User**:
   ```bash
   railway run python back/manage.py createsuperuser
   ```

5. **Access Admin Panel**:
   - Visit: `https://babs-production.up.railway.app/admin/`

## 📁 Project Structure

```
Root requirements.txt → Points to back/requirements.txt
Procfile → Defines start command
nixpacks.toml → Build configuration
back/ → Django application
```

## 🐛 Troubleshooting

### Build Failures
```bash
# Check logs
railway logs

# Verify requirements
cat requirements.txt
```

### Database Issues
- SQLite is not persistent on Railway (data resets on redeploy)
- **Solution**: Add PostgreSQL database (see above)

### Static Files Not Loading
- Whitenoise is configured to serve static files
- Collectstatic runs automatically during build
- Check: `https://your-app.railway.app/static/`

### CORS Errors
- Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Check browser console for specific error messages
- Ensure URLs don't have trailing slashes

### Application Crashes
```bash
# View recent logs
railway logs

# Common issues:
# - Missing environment variables
# - Database connection errors
# - Port binding issues (should use $PORT)
```

## 🔄 Updating Your Deployment

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Deploy to Railway
railway up
```

## 📊 Monitoring

- **Logs**: `railway logs` or Railway dashboard
- **Metrics**: Available in Railway dashboard
- **Health Check**: Visit your app URL to verify it's running

## 🎯 Next Steps

1. ✅ Backend deployed successfully
2. ⏳ Add PostgreSQL database
3. ⏳ Set environment variables
4. ⏳ Create superuser
5. ⏳ Deploy frontend to Vercel/Netlify
6. ⏳ Configure custom domain (optional)

# Deployment Guide

## Backend Deployment (Django)

### Option 1: Railway (Recommended - Free Tier Available)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose the `back` folder as root directory
   - Railway will auto-detect Django and deploy

3. **Add Environment Variables**
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-app.railway.app
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   PAYSTACK_SECRET_KEY=your-key
   PAYSTACK_PUBLIC_KEY=your-key
   ```

4. **Add PostgreSQL Database**
   - In Railway dashboard, click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set DATABASE_URL

5. **Get Your Backend URL**
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

### Option 2: Render (Free Tier Available)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Root Directory: `back`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn config.wsgi:application`

3. **Add Environment Variables** (same as Railway)

4. **Add PostgreSQL Database**
   - Create new PostgreSQL database in Render
   - Copy the Internal Database URL to your web service

---

## Frontend Deployment (Vercel)

### Update Environment Variable

1. **Go to Vercel Dashboard**
   - Select your project
   - Go to Settings → Environment Variables

2. **Add Backend URL**
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```
   (Replace with your actual Railway/Render backend URL)

3. **Redeploy**
   - Go to Deployments
   - Click "..." on latest deployment → "Redeploy"

---

## Quick Deploy Commands

### Backend (Railway)
```bash
cd back
railway login
railway init
railway up
railway open
```

### Frontend (Vercel)
```bash
cd front
vercel --prod
```

---

## Post-Deployment Steps

1. **Load Initial Data**
   ```bash
   # SSH into Railway/Render
   python manage.py load_products
   ```

2. **Create Admin User**
   ```bash
   python manage.py createsuperuser
   ```

3. **Test API**
   - Visit: `https://your-backend.railway.app/api/products/`
   - Should return JSON with products

4. **Test Frontend**
   - Visit: `https://your-frontend.vercel.app`
   - Products should load from backend

---

## Troubleshooting

### CORS Errors
- Make sure `CORS_ALLOWED_ORIGINS` includes your Vercel URL
- Check that both HTTP and HTTPS are allowed if needed

### Database Errors
- Verify DATABASE_URL is set correctly
- Run migrations: `python manage.py migrate`

### Static Files Not Loading
- Run: `python manage.py collectstatic --noinput`
- Check STATIC_ROOT and STATIC_URL settings

### Products Not Loading
- Check backend URL in Vercel environment variables
- Verify API endpoints return data
- Check browser console for CORS errors

---

## Environment Variables Summary

### Backend (Railway/Render)
- `SECRET_KEY` - Django secret key
- `DEBUG` - Set to False
- `ALLOWED_HOSTS` - Your backend domain
- `CORS_ALLOWED_ORIGINS` - Your Vercel frontend URL
- `PAYSTACK_SECRET_KEY` - Paystack secret
- `PAYSTACK_PUBLIC_KEY` - Paystack public key
- `DATABASE_URL` - Auto-set by Railway/Render

### Frontend (Vercel)
- `VITE_API_BASE_URL` - Your backend API URL (e.g., https://your-app.railway.app/api)

---

## Cost Estimate

- **Railway**: Free tier (500 hours/month) - Enough for small projects
- **Render**: Free tier (750 hours/month) - Sleeps after inactivity
- **Vercel**: Free tier - Unlimited bandwidth for personal projects

Both are free for hobby projects!

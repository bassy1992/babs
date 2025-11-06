# 🚀 Deploy Django Backend to Railway - Quick Guide

## The Issue
Railway can't auto-detect your Django app because it's in a monorepo (`back/` folder).

## ✅ Simple Solution: Set Root Directory in Railway

Follow these exact steps:

### Step 1: Create Railway Project

1. Go to https://railway.app and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your **`babs`** repository
5. Railway will try to deploy and fail - that's expected!

### Step 2: Configure Root Directory ⭐ MOST IMPORTANT

1. In Railway dashboard, click on your service
2. Go to **Settings** tab
3. Scroll to **"Source"** section
4. Find **"Root Directory"** field
5. Enter: **`back`**
6. Click **"Save"**

### Step 3: Configure Start Command

Still in Settings, scroll to **"Deploy"** section:

**Start Command:**
```bash
python manage.py migrate && python manage.py collectstatic --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

Click **"Save"**

### Step 4: Add PostgreSQL Database

1. In Railway dashboard, click **"New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway automatically connects it to your service

### Step 5: Add Environment Variables

In your service Settings → **Variables** tab, add:

```env
SECRET_KEY=<generate-this-see-below>
DEBUG=False
ALLOWED_HOSTS=*.railway.app
CORS_ALLOWED_ORIGINS=https://essentialsbybaabie.com,https://front-po7zs1q9x-bassys-projects-fca17413.vercel.app
PAYSTACK_SECRET_KEY=sk_test_9f29dc642fcd522fafeb5674ec85453ccfdd730f
PAYSTACK_PUBLIC_KEY=pk_test_da5790fb0b742152633ddc06895a71aa795add3d
```

**Generate SECRET_KEY:**
```bash
cd back
python generate_secret_key.py
```
Copy the output and paste it as the `SECRET_KEY` value.

### Step 6: Redeploy

1. Go to **Deployments** tab
2. Click **"Deploy"** or wait for auto-deploy
3. Watch the logs - you should see:
   - Installing dependencies
   - Collecting static files
   - Running migrations
   - Starting Gunicorn

### Step 7: Get Your Backend URL

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://your-app.railway.app`)

## 🧪 Test Your Deployment

Visit these URLs (replace with your Railway domain):

- ✅ Products API: `https://your-app.railway.app/api/products/`
- ✅ API Docs: `https://your-app.railway.app/api/docs/`
- ✅ Admin Panel: `https://your-app.railway.app/admin/`

## 🔗 Connect to Frontend

### Update Vercel Environment Variable

1. Go to Vercel dashboard
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Update or add:
   ```
   VITE_API_BASE_URL=https://your-app.railway.app/api
   ```
5. **Redeploy** your frontend

## 📋 Post-Deployment Tasks

### Create Superuser

In Railway dashboard, go to your service and open the **Shell** tab, then run:

```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

## ✅ Success Checklist

- [ ] Root Directory set to `back`
- [ ] PostgreSQL database added
- [ ] All environment variables configured
- [ ] SECRET_KEY generated and added
- [ ] Deployment successful (check logs)
- [ ] API endpoints returning data
- [ ] Admin panel accessible
- [ ] Frontend connected to backend
- [ ] No CORS errors

## 🎉 You're Live!

Once deployed, your backend is live and your frontend can fetch data from the API!

---

**See `RAILWAY_SETTINGS_SCREENSHOT.md` for visual guide of exact settings.**

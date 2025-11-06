# Railway Monorepo Setup Guide

## 🎯 Problem Solved

Your project has a monorepo structure:
```
babs/
├── back/     # Django backend
├── front/    # React frontend
└── ...
```

Railway was trying to build from the root and couldn't find the Django app. This is now fixed!

## ✅ Solution: nixpacks.toml

I've created a `nixpacks.toml` file at the root that tells Railway how to build your Django backend:

```toml
[phases.setup]
nixPkgs = ["python312"]

[phases.install]
cmds = ["cd back && pip install -r requirements.txt"]

[phases.build]
cmds = ["cd back && python manage.py collectstatic --noinput"]

[start]
cmd = "cd back && python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT"
```

This configuration:
- ✅ Uses Python 3.12
- ✅ Installs dependencies from `back/requirements.txt`
- ✅ Collects static files
- ✅ Runs migrations on startup
- ✅ Starts Gunicorn server

## 🚀 Deploy to Railway

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add Railway monorepo configuration"
git push origin main
```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `babs` repository
5. Railway will automatically detect `nixpacks.toml`

### Step 3: Add PostgreSQL Database

1. In Railway dashboard, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway automatically sets `DATABASE_URL` environment variable

### Step 4: Add Environment Variables

In Railway Settings → Variables, add:

```env
SECRET_KEY=<generate-using-back/generate_secret_key.py>
DEBUG=False
ALLOWED_HOSTS=*.railway.app
CORS_ALLOWED_ORIGINS=https://essentialsbybaabie.com,https://your-vercel-app.vercel.app
PAYSTACK_SECRET_KEY=sk_test_9f29dc642fcd522fafeb5674ec85453ccfdd730f
PAYSTACK_PUBLIC_KEY=pk_test_da5790fb0b742152633ddc06895a71aa795add3d
```

### Step 5: Deploy

Railway will automatically:
1. Detect the `nixpacks.toml` configuration
2. Install Python 3.12
3. Install dependencies from `back/requirements.txt`
4. Collect static files
5. Run migrations
6. Start Gunicorn server

## 🧪 Verify Deployment

After deployment, test these endpoints:

- Health check: `https://your-app.railway.app/api/products/`
- API docs: `https://your-app.railway.app/api/docs/`
- Admin panel: `https://your-app.railway.app/admin/`

## 🔧 Alternative: Railway Service Settings

If you prefer using Railway's UI instead of `nixpacks.toml`:

1. Go to your service Settings
2. Under "Build", set:
   - **Root Directory**: `back`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

Then you can delete `nixpacks.toml` if you want.

## 📝 Files Created

- `nixpacks.toml` - Railway build configuration for monorepo
- Updated `back/config/settings.py` - Added SSL support for PostgreSQL
- Updated `back/RAILWAY_DEPLOYMENT.md` - Added monorepo notes

## 🎉 You're Ready!

Your monorepo is now properly configured for Railway. Just push to GitHub and deploy!

## 🆘 Troubleshooting

### If Railway still can't find the app:

**Option 1:** Use Railway Service Settings (recommended)
- Set Root Directory to `back` in Railway dashboard

**Option 2:** Keep using nixpacks.toml
- Make sure it's at the repository root
- Verify it's pushed to GitHub

### Check Railway Logs

```bash
railway logs
```

Look for:
- "Installing dependencies..."
- "Collecting static files..."
- "Running migrations..."
- "Booting worker with pid..."

## 📚 Resources

- [Railway Nixpacks Documentation](https://nixpacks.com/)
- [Railway Monorepo Guide](https://docs.railway.app/deploy/monorepo)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/)

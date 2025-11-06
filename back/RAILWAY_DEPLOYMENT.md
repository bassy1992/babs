# Railway Deployment Guide

Your Django backend is **ready for Railway deployment**! Here's everything you need to know.

## ✅ Pre-configured Files

Your backend already has all necessary Railway configuration:

- ✅ `railway.json` - Railway deployment configuration
- ✅ `requirements.txt` - Python dependencies with gunicorn
- ✅ `runtime.txt` - Python 3.12 specified
- ✅ `Procfile` - Backup deployment command
- ✅ `settings.py` - Production-ready with dj-database-url, whitenoise, CORS
- ✅ `.env.example` - Environment variable template

## 🚀 Deployment Steps

### 1. Create Railway Project

```bash
# Option A: Using Railway CLI
railway login
cd back
railway init
railway up

# Option B: Using Railway Dashboard
# Go to https://railway.app
# Click "New Project" → "Deploy from GitHub repo"
# Select your repository
# Set root directory to "back"
```

### 2. Add PostgreSQL Database

In Railway dashboard:
1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway automatically sets `DATABASE_URL` environment variable
3. Your app will use PostgreSQL instead of SQLite

### 3. Configure Environment Variables

In Railway dashboard, add these variables:

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app.railway.app,your-custom-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://essentialsbybaabie.com
PAYSTACK_SECRET_KEY=sk_test_your_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
```

**Generate SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 4. Deploy

Railway will automatically:
- Detect Python/Django project
- Install dependencies from `requirements.txt`
- Run migrations: `python manage.py migrate`
- Start server: `gunicorn config.wsgi:application`

### 5. Get Your Backend URL

After deployment:
1. Go to your Railway project
2. Click "Settings" → "Domains"
3. Copy the generated URL (e.g., `https://your-app.railway.app`)
4. Use this URL in your frontend's `VITE_API_BASE_URL`

## 📋 Post-Deployment Tasks

### Create Superuser

```bash
# Using Railway CLI
railway run python manage.py createsuperuser

# Or use Railway's shell in dashboard
```

### Load Sample Data (if you have fixtures)

```bash
railway run python manage.py loaddata products
```

### Access Admin Panel

Visit: `https://your-app.railway.app/admin/`

### Test API Endpoints

- Products: `https://your-app.railway.app/api/products/`
- Collections: `https://your-app.railway.app/api/collections/`
- API Docs: `https://your-app.railway.app/api/docs/`

## 🔧 Configuration Details

### Railway.json Explained

```json
{
  "build": {
    "builder": "NIXPACKS"  // Railway's smart builder
  },
  "deploy": {
    "startCommand": "python manage.py migrate && gunicorn config.wsgi:application",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

This ensures:
- Migrations run automatically on each deploy
- Gunicorn serves your Django app
- Auto-restart on failures (up to 10 times)

### Database Configuration

Your `settings.py` uses `dj-database-url` which automatically reads Railway's `DATABASE_URL`:

```python
DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",  # Fallback for local dev
        conn_max_age=600,
        conn_health_checks=True,
    )
}
```

### Static Files

Whitenoise is configured to serve static files:
- No need for separate CDN or storage
- Compressed and cached automatically
- Works perfectly on Railway

## 🔍 Monitoring & Logs

### View Logs

```bash
# Using CLI
railway logs

# Or in Railway dashboard
# Click on your service → "Logs" tab
```

### Common Log Checks

- Migration status: Look for "Applying migrations..."
- Server start: Look for "Booting worker with pid"
- Errors: Look for "ERROR" or "Exception"

## 🐛 Troubleshooting

### Issue: "DisallowedHost" Error

**Solution:** Add your Railway domain to `ALLOWED_HOSTS`:
```env
ALLOWED_HOSTS=your-app.railway.app,*.railway.app
```

### Issue: CORS Errors from Frontend

**Solution:** Add your Vercel URL to `CORS_ALLOWED_ORIGINS`:
```env
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://essentialsbybaabie.com
```

### Issue: Database Connection Error

**Solution:** Verify PostgreSQL is added and `DATABASE_URL` is set:
```bash
railway variables
```

### Issue: Static Files Not Loading

**Solution:** Run collectstatic (should happen automatically):
```bash
railway run python manage.py collectstatic --noinput
```

### Issue: Migrations Not Running

**Solution:** Run manually:
```bash
railway run python manage.py migrate
```

## 💰 Railway Pricing

- **Free Tier**: $5 credit/month (enough for small projects)
- **Hobby Plan**: $5/month for more resources
- **Pro Plan**: $20/month for production apps

Your Django app should run fine on the free tier for development/testing.

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to your connected GitHub branch:

1. Make changes to your code
2. Commit and push to GitHub
3. Railway detects changes and redeploys
4. Migrations run automatically
5. New version goes live

## 📝 Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `SECRET_KEY` - Generated Django secret key
- [ ] `DEBUG` - Set to `False`
- [ ] `ALLOWED_HOSTS` - Your Railway domain
- [ ] `CORS_ALLOWED_ORIGINS` - Your frontend URLs
- [ ] `PAYSTACK_SECRET_KEY` - Your Paystack secret
- [ ] `PAYSTACK_PUBLIC_KEY` - Your Paystack public key
- [ ] `DATABASE_URL` - Auto-set by Railway PostgreSQL

## 🎯 Next Steps

1. Deploy backend to Railway
2. Get your Railway backend URL
3. Update Vercel frontend environment variable:
   ```env
   VITE_API_BASE_URL=https://your-app.railway.app/api
   ```
4. Redeploy frontend on Vercel
5. Test the full integration

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/)
- [Railway CLI Reference](https://docs.railway.app/develop/cli)

---

**Your backend is production-ready!** Just add environment variables and deploy. 🚀

# Railway Deployment Checklist

## ✅ Pre-Deployment Verification

Run these checks before deploying:

### 1. Dependencies Check
```bash
cd back
pip install -r requirements.txt
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in values:
```bash
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux
```

### 3. Test Locally
```bash
python manage.py migrate
python manage.py runserver
```
Visit: http://localhost:8000/api/products/

### 4. Generate SECRET_KEY
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## 🚀 Railway Deployment

### Step 1: Install Railway CLI (Optional)
```bash
npm install -g @railway/cli
# or
curl -fsSL https://railway.app/install.sh | sh
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Initialize Project
```bash
cd back
railway init
```

### Step 4: Add PostgreSQL
In Railway dashboard:
- Click "New" → "Database" → "Add PostgreSQL"

### Step 5: Set Environment Variables
In Railway dashboard, add:
```
SECRET_KEY=<generated-key-from-step-4>
DEBUG=False
ALLOWED_HOSTS=*.railway.app
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
```

### Step 6: Deploy
```bash
railway up
```

### Step 7: Run Migrations (if needed)
```bash
railway run python manage.py migrate
```

### Step 8: Create Superuser
```bash
railway run python manage.py createsuperuser
```

## 🧪 Post-Deployment Testing

### 1. Check API Endpoints
- [ ] `https://your-app.railway.app/api/products/`
- [ ] `https://your-app.railway.app/api/collections/`
- [ ] `https://your-app.railway.app/api/docs/`
- [ ] `https://your-app.railway.app/admin/`

### 2. Test CORS
Open browser console on your frontend and check for CORS errors.

### 3. Test Database
Create a product in admin panel and verify it appears in API.

## 🔗 Connect to Frontend

### Update Vercel Environment Variable
```bash
cd front
# Add to Vercel dashboard:
VITE_API_BASE_URL=https://your-app.railway.app/api
```

### Redeploy Frontend
```bash
vercel --prod
```

## 📊 Monitoring

### View Logs
```bash
railway logs
```

### Check Service Status
```bash
railway status
```

### View Environment Variables
```bash
railway variables
```

## 🎯 Success Criteria

- [ ] Backend deploys without errors
- [ ] PostgreSQL database connected
- [ ] Migrations completed successfully
- [ ] API endpoints return data
- [ ] Admin panel accessible
- [ ] Frontend can fetch data from backend
- [ ] No CORS errors in browser console
- [ ] Paystack integration works (if configured)

## 🆘 Quick Fixes

### If deployment fails:
```bash
railway logs  # Check error messages
```

### If migrations fail:
```bash
railway run python manage.py migrate --run-syncdb
```

### If static files missing:
```bash
railway run python manage.py collectstatic --noinput
```

### If CORS errors:
Update `CORS_ALLOWED_ORIGINS` in Railway dashboard to include your frontend URL.

---

**Ready to deploy!** Follow the steps above and your backend will be live on Railway. 🚀

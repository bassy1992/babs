# Vercel 404 Error - Fixed

## What Was Wrong

The Vercel deployment was trying to use a serverless function (`/api/index.js`) that was causing 404 errors. Since you have a Django backend handling all API calls, you don't need serverless functions in your frontend.

## Changes Made

1. **Updated `vercel.json`**:
   - Removed serverless function configuration
   - Changed build command to `npm run build:client` (only builds the SPA)
   - Simplified rewrites to only handle SPA routing

2. **Removed `front/api/index.js`**:
   - This serverless function was unnecessary and causing errors

## How to Deploy

### Step 1: Make Sure Your Backend is Deployed

Your Django backend needs to be live first. Deploy it to Railway or Render:

**Railway (Recommended):**
```bash
cd back
railway login
railway init
railway up
```

Get your backend URL (e.g., `https://your-app.railway.app`)

### Step 2: Update Vercel Environment Variable

In your Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Update `VITE_API_BASE_URL` to your backend URL:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```

### Step 3: Redeploy to Vercel

```bash
cd front
vercel --prod
```

Or push to your main branch if you have automatic deployments enabled.

### Step 4: Update Backend CORS

Add your Vercel URL to your backend's allowed origins:

```env
# back/.env (on Railway/Render)
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app
```

Redeploy your backend after this change.

## Testing

After deployment, test these:
- ✅ Homepage loads
- ✅ Products display from Django backend
- ✅ Cart functionality works
- ✅ Checkout flow completes
- ✅ No 404 errors in console

## Architecture

```
Frontend (Vercel)          Backend (Railway/Render)
├── Static SPA             ├── Django REST API
├── React Router           ├── Products
└── Calls backend API  →   ├── Orders
                           └── Payments (Paystack)
```

Your frontend is now a pure static SPA that calls your Django backend for all data and API operations.

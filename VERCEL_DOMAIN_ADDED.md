# Vercel Domain Added to Backend

## Changes Made

Added your Vercel deployment URL to the backend CORS configuration:

### Domain Added:
- `https://front-po7zs1q9x-bassys-projects-fca17413.vercel.app`
- `https://essentialsbybaabie.com` (your custom domain)

### Files Updated:
1. `back/.env` - Local development environment
2. `back/.env.example` - Example configuration

## Production Deployment Required

**IMPORTANT:** You need to update the environment variables on your production backend:

### If using Railway:
1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to "Variables" tab
4. Update `CORS_ALLOWED_ORIGINS` to:
   ```
   https://front-po7zs1q9x-bassys-projects-fca17413.vercel.app,https://essentialsbybaabie.com,http://localhost:8080
   ```
5. Save and redeploy

### If using Render:
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update `CORS_ALLOWED_ORIGINS` environment variable to:
   ```
   https://front-po7zs1q9x-bassys-projects-fca17413.vercel.app,https://essentialsbybaabie.com,http://localhost:8080
   ```
5. Save changes (auto-redeploys)

## Testing

After updating production:
1. Visit your Vercel URL: https://front-po7zs1q9x-bassys-projects-fca17413.vercel.app
2. Check browser console for CORS errors
3. Test API calls (products, collections, etc.)
4. Verify checkout flow works

## Current CORS Configuration

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'https://front-po7zs1q9x-bassys-projects-fca17413.vercel.app',
    'https://essentialsbybaabie.com'
]
```

## Notes

- The Vercel URL is your deployment preview URL
- The custom domain (essentialsbybaabie.com) is also included
- Local development URLs are kept for testing
- CORS credentials are enabled for cookie/session support

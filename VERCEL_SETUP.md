# Vercel Frontend Setup

## Set Environment Variable

Your frontend needs to know where the backend is. Set this in Vercel:

### Option 1: Vercel Dashboard (Easiest)
1. Go to https://vercel.com/dashboard
2. Select your project: `front`
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://babs-production.up.railway.app/api`
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**
6. Go to **Deployments** and click **Redeploy** on the latest deployment

### Option 2: Vercel CLI
```bash
cd front
vercel env add VITE_API_BASE_URL production
# When prompted, enter: https://babs-production.up.railway.app/api

# Then redeploy
vercel --prod
```

## Verify Setup

After redeploying, your frontend at:
`https://front-ewft7p4v6-bassys-projects-fca17413.vercel.app`

Should now connect to your backend at:
`https://babs-production.up.railway.app/api`

## Testing

1. Open your Vercel frontend URL
2. Open browser DevTools (F12) → Network tab
3. Refresh the page
4. You should see API calls to `babs-production.up.railway.app` instead of `localhost:8000`

## Troubleshooting

### CORS Errors
If you see CORS errors, verify Railway has the correct CORS settings:
```bash
railway variables
```

Should show:
```
CORS_ALLOWED_ORIGINS=https://front-ewft7p4v6-bassys-projects-fca17413.vercel.app,http://localhost:8080
```

### API Not Found (404)
- Check that Railway backend is running: `railway logs`
- Verify the API URL is correct in Vercel environment variables

### Connection Refused
- Make sure you redeployed Vercel after setting the environment variable
- Clear browser cache and hard refresh (Ctrl+Shift+R)

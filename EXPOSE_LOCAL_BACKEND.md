# Exposing Local Backend to Vercel Frontend

## Problem
Your backend is running on your local PC, but your Vercel frontend needs to access it over the internet.

## Solutions

### Option 1: ngrok (Recommended for Testing)

1. **Install ngrok:**
   - Download from: https://ngrok.com/download
   - Or use: `npm install -g ngrok`

2. **Start your Django backend:**
   ```bash
   cd back
   python manage.py runserver 0.0.0.0:8000
   ```

3. **In a new terminal, expose it with ngrok:**
   ```bash
   ngrok http 8000
   ```

4. **Copy the HTTPS URL** (looks like: `https://abc123.ngrok.io`)

5. **Update backend CORS:**
   Add the ngrok URL to `back/.env`:
   ```
   CORS_ALLOWED_ORIGINS=http://localhost:8080,https://abc123.ngrok.io,https://front-po7zs1q9x-bassys-projects-fca17413.vercel.app
   ```

6. **Update frontend API URL:**
   In `front/.env`:
   ```
   VITE_API_URL=https://abc123.ngrok.io
   ```

7. **Restart Django and redeploy frontend to Vercel**

**Note:** Free ngrok URLs change each time you restart. Paid plans give you a permanent URL.

---

### Option 2: Cloudflare Tunnel (Free, Permanent URL)

1. **Install Cloudflare Tunnel:**
   ```bash
   # Windows
   winget install --id Cloudflare.cloudflared

   # Or download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
   ```

2. **Start your Django backend:**
   ```bash
   cd back
   python manage.py runserver 0.0.0.0:8000
   ```

3. **Create a tunnel:**
   ```bash
   cloudflared tunnel --url http://localhost:8000
   ```

4. **Copy the HTTPS URL** provided

5. **Update CORS and frontend API URL** (same as ngrok steps 5-7)

---

### Option 3: Deploy Backend to Cloud (Recommended for Production)

Deploy your backend to a cloud service:

#### Railway (Easiest):
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your backend repo
5. Add environment variables
6. Get your backend URL (e.g., `https://your-app.railway.app`)

#### Render:
1. Go to https://render.com
2. Sign up
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure and deploy
6. Get your backend URL

#### Vercel (for Django):
- Not recommended for Django, better for Node.js/Python serverless

---

## Quick Start (ngrok)

```bash
# Terminal 1: Start Django
cd back
python manage.py runserver 0.0.0.0:8000

# Terminal 2: Start ngrok
ngrok http 8000

# Copy the https URL from ngrok (e.g., https://abc123.ngrok.io)
```

Then update:
1. `back/.env` - Add ngrok URL to CORS_ALLOWED_ORIGINS
2. `front/.env` - Set VITE_API_URL to ngrok URL
3. Restart Django
4. Redeploy frontend to Vercel

---

## Current Setup

Your files are already configured for local development:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:8080`

For Vercel to work, you need the backend accessible via HTTPS URL.

---

## Recommendation

**For Testing:** Use ngrok (quick and easy)
**For Production:** Deploy backend to Railway or Render (free tier available)

# Railway Deployment Guide

## Current Setup

Your Railway deployment is configured to run the Django backend only. The frontend should be deployed separately (e.g., on Vercel/Netlify).

## Required Environment Variables

Set these in your Railway project dashboard:

### Essential Variables
```
SECRET_KEY=<generate-a-secure-key>
DEBUG=False
ALLOWED_HOSTS=<your-railway-domain>.railway.app
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,https://essentialsbybaabie.com
```

### Database (Optional - Railway provides PostgreSQL)
If you add a PostgreSQL database to your Railway project, it will automatically set `DATABASE_URL`. Otherwise, it will use SQLite (not recommended for production).

To add PostgreSQL:
1. Go to your Railway project
2. Click "New" → "Database" → "Add PostgreSQL"
3. Railway will automatically set the `DATABASE_URL` variable

### Payment Integration (Optional)
```
PAYSTACK_SECRET_KEY=<your-paystack-secret-key>
PAYSTACK_PUBLIC_KEY=<your-paystack-public-key>
```

## Deployment Commands

```bash
# Deploy to Railway
railway up

# View logs
railway logs

# Open project in browser
railway open
```

## Post-Deployment

After successful deployment:

1. Get your Railway backend URL (e.g., `https://babs-production.up.railway.app`)
2. Update your frontend `.env` to point to this URL
3. Add the frontend URL to `CORS_ALLOWED_ORIGINS` in Railway
4. Create a superuser (see below)

## Creating a Superuser

Railway doesn't provide direct shell access, so you need to create a management command or use Railway's CLI:

```bash
railway run python back/manage.py createsuperuser
```

## Troubleshooting

### Build fails
- Check Railway logs: `railway logs`
- Ensure all dependencies are in `back/requirements.txt`

### Database connection errors
- Add PostgreSQL database in Railway dashboard
- Verify `DATABASE_URL` is set automatically

### Static files not loading
- Whitenoise is configured to serve static files
- Ensure `collectstatic` runs during build (it's in nixpacks.toml)

### CORS errors
- Add your frontend domain to `CORS_ALLOWED_ORIGINS`
- Include both production and preview URLs if using Vercel

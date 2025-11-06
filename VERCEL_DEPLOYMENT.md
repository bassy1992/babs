# Vercel Deployment Guide

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. Backend deployed (Railway, Render, or similar)
3. Vercel CLI installed (optional): `npm i -g vercel`

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard

1. **Connect Repository**
   - Go to https://vercel.com/new
   - Import your Git repository
   - Select the `front` directory as the root

2. **Configure Project**
   - Framework Preset: `Vite`
   - Root Directory: `front`
   - Build Command: `npm run build`
   - Output Directory: `dist/spa`

3. **Environment Variables**
   Add these in Vercel dashboard (Settings → Environment Variables):
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   PING_MESSAGE=pong
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Deploy via CLI

```bash
cd front

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? [your-project-name]
# - Directory? ./
# - Override settings? Yes
#   - Build Command: npm run build
#   - Output Directory: dist/spa
#   - Development Command: npm run dev

# Add environment variables
vercel env add VITE_API_BASE_URL
# Enter: https://your-backend.railway.app/api

# Deploy to production
vercel --prod
```

## Configuration Files

### vercel.json
Already configured in `front/vercel.json`:
- Handles API routes via serverless functions
- SPA routing with fallback to index.html
- Function memory and timeout settings

### package.json
Build script configured:
- `vercel-build`: Runs both client and server builds
- Outputs to `dist/spa` for static files
- Outputs to `dist/server` for serverless functions

## Post-Deployment Steps

### 1. Update Backend CORS

Add your Vercel URL to backend's allowed origins:

```env
# back/.env
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app
```

Redeploy your backend after updating.

### 2. Test the Deployment

Visit your Vercel URL and test:
- Homepage loads
- Products display correctly
- Cart functionality works
- Checkout flow completes
- Payment integration works

### 3. Configure Custom Domain (Optional)

In Vercel dashboard:
1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://your-backend.railway.app/api` |
| `PING_MESSAGE` | Server health check message | `pong` |

## Troubleshooting

### Build Fails

**Issue**: Build command fails
**Solution**: 
- Check `package.json` scripts are correct
- Ensure all dependencies are in `dependencies` or `devDependencies`
- Check build logs for specific errors

### API Calls Fail

**Issue**: Frontend can't reach backend
**Solution**:
- Verify `VITE_API_BASE_URL` is set correctly
- Check backend CORS settings include Vercel URL
- Ensure backend is running and accessible

### 404 on Page Refresh

**Issue**: Direct URL access returns 404
**Solution**:
- Verify `vercel.json` has correct rewrites
- Check output directory is `dist/spa`

### Serverless Function Timeout

**Issue**: API routes timeout
**Solution**:
- Increase `maxDuration` in `vercel.json`
- Optimize server-side code
- Consider upgrading Vercel plan

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

Each deployment gets a unique URL for testing.

## Monitoring

Access deployment logs and analytics:
1. Go to your project dashboard
2. Click on a deployment
3. View:
   - Build logs
   - Function logs
   - Analytics
   - Performance metrics

## Rollback

To rollback to a previous deployment:
1. Go to Deployments tab
2. Find the working deployment
3. Click "..." → "Promote to Production"

## Cost Considerations

Vercel Free Tier includes:
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function executions
- Automatic HTTPS

For production apps with high traffic, consider Pro plan.

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Use Vercel's encrypted environment variables
3. **CORS**: Restrict backend CORS to your Vercel domains only
4. **HTTPS**: Vercel provides automatic HTTPS (don't disable)

## Next Steps

After successful deployment:
1. Set up custom domain
2. Configure analytics
3. Set up monitoring/alerts
4. Test payment flow with live keys
5. Update README with live URL

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions

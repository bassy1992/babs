# Vercel Deployment Checklist

## Pre-Deployment

- [ ] Backend is deployed and accessible (Railway/Render)
- [ ] Backend API URL is confirmed
- [ ] Paystack keys are configured in backend
- [ ] Test backend API endpoints are working

## Vercel Setup

- [ ] Create Vercel account
- [ ] Install Vercel CLI (optional): `npm i -g vercel`
- [ ] Connect Git repository to Vercel

## Configuration

- [ ] Set Root Directory to `front`
- [ ] Set Build Command to `npm run build`
- [ ] Set Output Directory to `dist/spa`
- [ ] Add environment variable: `VITE_API_BASE_URL`
- [ ] Add environment variable: `PING_MESSAGE` (optional)

## Backend Updates

- [ ] Add Vercel URL to backend `CORS_ALLOWED_ORIGINS`
- [ ] Include preview URLs: `https://your-app-*.vercel.app`
- [ ] Redeploy backend with updated CORS settings

## Testing

- [ ] Homepage loads correctly
- [ ] Products page displays items
- [ ] Product detail pages work
- [ ] Collections page works
- [ ] Cart functionality works
- [ ] Add to cart works
- [ ] Checkout flow completes
- [ ] Payment integration works
- [ ] Order confirmation displays
- [ ] About page loads
- [ ] Navigation works on all pages
- [ ] Mobile responsive design works

## Post-Deployment

- [ ] Test all API endpoints from production
- [ ] Verify payment flow with test keys
- [ ] Check browser console for errors
- [ ] Test on multiple devices/browsers
- [ ] Set up custom domain (optional)
- [ ] Update README with live URL
- [ ] Monitor deployment logs
- [ ] Set up error tracking (optional)

## Production Readiness

- [ ] Switch to Paystack live keys in backend
- [ ] Set backend `DEBUG=False`
- [ ] Configure production database
- [ ] Set up SSL/HTTPS (automatic on Vercel)
- [ ] Test payment with real cards
- [ ] Set up monitoring/alerts
- [ ] Create backup strategy

## Quick Commands

```bash
# Deploy to Vercel
cd front
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Add environment variable
vercel env add VITE_API_BASE_URL
```

## Common Issues

### Build Fails
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for errors

### API Not Working
- Verify `VITE_API_BASE_URL` is correct
- Check backend CORS settings
- Ensure backend is running

### 404 Errors
- Verify `vercel.json` rewrites are correct
- Check output directory setting

### Payment Issues
- Verify Paystack keys are correct
- Check backend payment endpoint
- Test with Paystack test cards

## Support Resources

- Vercel Documentation: https://vercel.com/docs
- Django CORS: https://pypi.org/project/django-cors-headers/
- Paystack Docs: https://paystack.com/docs

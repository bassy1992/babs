# Vercel Deployment Guide

This project is configured for deployment on Vercel with both frontend and API routes.

## Setup

1. **Install Vercel CLI** (optional, for local testing):
   ```bash
   npm i -g vercel
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Environment Variables

Set these environment variables in your Vercel dashboard:

- `VITE_PUBLIC_BUILDER_KEY` - Your Builder.io public key
- `PING_MESSAGE` - Custom ping message for the API

## Deployment

### Option 1: Deploy via Vercel Dashboard
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Set environment variables in the dashboard
4. Deploy

### Option 2: Deploy via CLI
```bash
vercel --prod
```

## Project Structure

- `/api/` - Serverless functions (Express.js routes)
- `/client/` - React frontend source
- `/dist/spa/` - Built frontend (generated during build)
- `vercel.json` - Vercel configuration

## API Routes

All API routes are available at `/api/*` and are handled by serverless functions.

Example endpoints:
- `GET /api/ping` - Health check
- `GET /api/demo` - Demo endpoint

## Local Development

```bash
npm run dev
```

This starts the Vite dev server with Express middleware for API routes.

## Build Process

The build process:
1. `vercel-build` script runs `build:client`
2. Frontend is built to `dist/spa/`
3. API routes are handled by serverless functions in `/api/`

## Notes

- The frontend is served as static files
- API routes are serverless functions
- Environment variables prefixed with `VITE_` are available in the frontend
- Server-only environment variables are only available in API routes
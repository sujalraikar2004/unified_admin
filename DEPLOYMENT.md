# 🚀 ADMIN PANEL - VERCEL DEPLOYMENT GUIDE

## ✅ Files Created/Updated:
1. ✅ `vercel.json` - Vercel configuration
2. ✅ `.env.example` - Environment variables template
3. ✅ `.env.local` - Local development environment
4. ✅ `src/lib/api.js` - Fixed API calls to use proper base URL

## 📋 Pre-Deployment Checklist:

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

## 🌐 Deployment Steps:

### Step 1: Deploy from Admin Directory
```bash
cd /home/sujal/unified/admin
vercel
```

### Step 2: Configure Environment Variables in Vercel Dashboard
After first deployment, go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add this variable:
- **Name:** `VITE_API_URL`
- **Value:** Your backend URL (e.g., `https://unified-backend.vercel.app`)
- **Environments:** Production, Preview, Development

### Step 3: Redeploy After Adding Environment Variables
```bash
vercel --prod
```

## ⚙️ Configuration Details:

### vercel.json Structure:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@unified_backend_url"  // Reference to Vercel env variable
  }
}
```

### Routes Configuration:
- `/assets/*` → Static assets
- `/*.(js|css|images)` → Build artifacts  
- `/*` → SPA fallback to index.html

## 🔧 Local Development:

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env.local (already created)
```bash
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```

## ✅ What Was Fixed:

### 🔴 CRITICAL FIXES:
1. **API Base URL Issue** - All fetch calls now use `${API_BASE_URL}` prefix
   - Fixed: `createEvent`, `updateEvent`, `uploadGalleryItem`
   
2. **Missing vercel.json** - Created with proper Vite SPA configuration

3. **Environment Variables** - Added VITE_API_URL configuration

4. **Local Development** - Created .env.local for local testing

## 🌍 Production Checklist:

- [ ] Backend deployed to Vercel
- [ ] Backend URL obtained (e.g., https://your-backend.vercel.app)
- [ ] Environment variable `VITE_API_URL` set in Vercel Dashboard
- [ ] Admin panel deployed: `vercel --prod`
- [ ] Test login functionality
- [ ] Test event creation/update
- [ ] Test gallery upload
- [ ] Verify CORS allows admin domain

## 🔍 Verification Commands:

### Test Build Locally
```bash
npm run build
npm run preview
```

### Check Environment Variables
```bash
vercel env ls
```

### View Deployment Logs
```bash
vercel logs
```

## 🚨 Common Issues:

### Issue: API calls return 404
**Solution:** Check VITE_API_URL is set correctly in Vercel Dashboard

### Issue: CORS errors
**Solution:** Add your admin URL to backend CORS whitelist

### Issue: Authentication fails
**Solution:** Ensure backend tokens are properly configured

## 📊 Expected Build Output:
```
✓ building client + server bundles...
✓ 1234 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-abc123.css     123.45 kB
dist/assets/index-abc123.js      456.78 kB
```

## 🎯 Post-Deployment:
1. Note your admin URL: `https://your-admin-panel.vercel.app`
2. Add this URL to backend CORS whitelist
3. Update backend environment variable: `ADMIN_FRONTEND_URL`
4. Test all functionality in production

---
**Ready to deploy! Run `vercel` in the admin directory.**

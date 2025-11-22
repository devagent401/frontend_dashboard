# ⚠️ CRITICAL: Restart Your Development Server

## Why Images Are Not Showing

The `next.config.mjs` changes **ONLY take effect after restarting the development server**. Next.js loads the config file once at startup.

## ✅ Step-by-Step Fix

### Step 1: Stop Your Current Server
In your terminal where `npm run dev` is running:
- Press `Ctrl + C` to stop the server

### Step 2: Start Fresh
```bash
cd frontend_Dashboard
npm run dev
```

### Step 3: Check Browser Console
1. Open your browser DevTools (F12)
2. Go to the Console tab
3. Look for these debug messages:
   ```
   🖼️ First Product: { ... }
   🖼️ Thumbnail URL: http://localhost:5000/api/v1/upload/preview/...
   🖼️ Gallery URLs: [ ... ]
   ```

### Step 4: Check Network Tab
1. Open DevTools → Network tab
2. Filter by "Img" or "All"
3. Look for image requests to `localhost:5000`
4. Check if they return:
   - ✅ **200 OK** - Images should show
   - ❌ **404** - Image file not found
   - ❌ **401** - Authentication issue
   - ❌ **Failed** - CORS or network issue

## 🔍 Troubleshooting

### Issue 1: Still Not Showing After Restart

**Check if the URL format is correct:**

Your images should have URLs like:
```
http://localhost:5000/api/v1/upload/preview/1763568028900-redzJtvALj-1533_20141.webp
```

If the URL is different, we need to adjust the `pathname` in `next.config.mjs`.

**To check, look at the console logs for the actual URL format.**

### Issue 2: Images Return 404

The images might be saved with a different path structure. Check your backend upload directory.

### Issue 3: Images Return 401 (Unauthorized)

The authentication token might not be sent for image requests. This should be fixed with the `unoptimized` flag we added.

### Issue 4: CORS Error

Make sure your backend has proper CORS headers:

```typescript
// Backend - cors configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

## 📊 What to Share If Still Not Working

Please share:
1. Console log output (the 🖼️ messages)
2. Network tab screenshot showing the image request
3. The actual error message from DevTools
4. Your backend upload path configuration

## 🔄 Alternative: Use Unoptimized Loader

If Next.js image optimization is causing issues, we can use all images as unoptimized:

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    unoptimized: true, // Disable all optimization
  },
};
```

But this should be a last resort.


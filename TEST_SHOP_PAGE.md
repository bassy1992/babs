# Test Shop Page - Quick Guide

## ✅ What Was Updated

The Shop page (`http://localhost:8080/shop`) now loads all products dynamically from your Django backend database.

## 🚀 Quick Test

### 1. Start Backend (Terminal 1)
```bash
cd back
python manage.py runserver
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
```

### 2. Start Frontend (Terminal 2)
```bash
cd front
npm run dev
```

**Expected output:**
```
Local: http://localhost:8080/
```

### 3. Open Shop Page
Go to: **http://localhost:8080/shop**

### 4. What You Should See

**Products Displayed:**
- ✅ Noir Bouquet (Bestseller) - $89
- ✅ Rose Velours - $79
- ✅ Amber Dusk - $95
- ✅ Citrus Bloom - $72

**Features Working:**
- ✅ Product count shows "4 products"
- ✅ All products have images
- ✅ Prices are displayed correctly
- ✅ Bestseller badge on Noir Bouquet

## 🧪 Test Features

### Test 1: Search
1. Type "rose" in search box
2. Should show only "Rose Velours"
3. Type "amber"
4. Should show only "Amber Dusk"
5. Clear search
6. Should show all 4 products again

### Test 2: Sort by Price
1. Select "Price: Low to high"
2. Order should be:
   - Citrus Bloom ($72)
   - Rose Velours ($79)
   - Noir Bouquet ($89)
   - Amber Dusk ($95)

3. Select "Price: High to low"
4. Order should be reversed:
   - Amber Dusk ($95)
   - Noir Bouquet ($89)
   - Rose Velours ($79)
   - Citrus Bloom ($72)

### Test 3: Loading State
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Should see brief loading spinner
5. Then products appear

### Test 4: API Calls
1. Keep DevTools Network tab open
2. Search for "rose"
3. Should see API call: `GET /api/products/?search=rose`
4. Change sort to "Price: Low to high"
5. Should see API call: `GET /api/products/?ordering=price`

## 🔍 Verify Backend Connection

### Check API Directly
Open in browser: **http://localhost:8000/api/products/**

Should see JSON response:
```json
{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "noir-bouquet",
      "name": "Noir Bouquet",
      "slug": "noir-bouquet",
      "price": "89.00",
      "image": "https://...",
      "badge": "Bestseller",
      "is_bestseller": true
    },
    ...
  ]
}
```

## 🎯 Homepage Test

### Test Homepage Too
Go to: **http://localhost:8080**

**Should see:**
- ✅ "Featured creations" section with 4 products
- ✅ "Signature collections" section with 3 collections
- ✅ All data loaded from database

## 🐛 Troubleshooting

### Issue: "Loading..." Forever
**Solution:**
1. Check backend is running on port 8000
2. Check browser console for errors
3. Verify: http://localhost:8000/api/products/

### Issue: No Products Showing
**Solution:**
```bash
cd back
python manage.py populate_data
```

### Issue: CORS Error
**Solution:**
1. Check `back/.env` has:
   ```
   CORS_ALLOWED_ORIGINS=http://localhost:8080
   ```
2. Restart backend

### Issue: Search Not Working
**Solution:**
1. Check Network tab in DevTools
2. Should see API calls with `?search=` parameter
3. Backend should return filtered results

## ✨ Success Indicators

✅ Products load from database
✅ Search filters products
✅ Sort changes order
✅ Loading spinner appears briefly
✅ No errors in console
✅ API calls visible in Network tab
✅ Product count updates correctly

## 📊 What's Happening Behind the Scenes

```
User visits /shop
    ↓
React component renders
    ↓
useProducts() hook called
    ↓
TanStack Query fetches data
    ↓
GET http://localhost:8000/api/products/
    ↓
Django backend queries database
    ↓
Returns JSON with products
    ↓
React transforms data
    ↓
Products displayed in grid
    ↓
User searches "rose"
    ↓
useProducts({ search: "rose" }) called
    ↓
GET http://localhost:8000/api/products/?search=rose
    ↓
Backend filters products
    ↓
Returns filtered results
    ↓
Grid updates with filtered products
```

## 🎉 You're Done!

The Shop page is now fully connected to your Django backend and loading products dynamically from the database!

**Next:** Update other pages (Product Detail, Collection, Search) using the same pattern.

See `PAGES_UPDATED.md` for details on what was changed.

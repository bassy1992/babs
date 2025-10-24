# Test Frontend-Backend Connection

## Quick Test Steps

### 1. Start Backend
```bash
cd back
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

### 2. Test Backend API

Open these URLs in your browser:

- **Products:** http://localhost:8000/api/products/
- **Featured Products:** http://localhost:8000/api/products/featured/
- **Collections:** http://localhost:8000/api/collections/
- **API Docs:** http://localhost:8000/api/docs/

You should see JSON data for products and collections.

### 3. Start Frontend
```bash
cd front
npm run dev
```

You should see:
```
Local: http://localhost:8080/
```

### 4. Test Cart Connection

Open browser console (F12) and run:

```javascript
// Check if API base URL is set
console.log(import.meta.env.VITE_API_BASE_URL);
// Should show: http://localhost:8000/api

// Check session key
console.log(localStorage.getItem('cart_session_key'));
// Should show a session key like: session_1234567890_abc123
```

### 5. Test Add to Cart

1. Go to http://localhost:8080
2. Open browser DevTools (F12) → Network tab
3. Click on any product
4. Click "Add to Cart"
5. Check Network tab for API calls:
   - Should see POST to `/api/orders/cart/{session}/add_item/`
   - Should return 200 OK

### 6. Test Cart Page

1. Go to http://localhost:8080/cart
2. Check Network tab:
   - Should see GET to `/api/orders/cart/{session}/`
   - Cart items should display

### 7. Verify Data Flow

```
Frontend (localhost:8080)
    ↓
    API Call
    ↓
Backend (localhost:8000)
    ↓
    Database Query
    ↓
    JSON Response
    ↓
Frontend Updates UI
```

## Common Issues & Solutions

### Issue: CORS Error
**Error:** `Access to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:8080' has been blocked by CORS policy`

**Solution:**
1. Check backend is running
2. Verify `back/.env` has:
   ```
   CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
   ```
3. Restart backend server

### Issue: 404 Not Found
**Error:** `GET http://localhost:8000/api/products/ 404 (Not Found)`

**Solution:**
1. Check backend is running on port 8000
2. Verify migrations are applied: `python manage.py migrate`
3. Verify data is populated: `python manage.py populate_data`

### Issue: Empty Cart
**Error:** Cart shows 0 items even after adding

**Solution:**
1. Check browser console for errors
2. Verify session key exists: `localStorage.getItem('cart_session_key')`
3. Check Network tab for API responses
4. Clear localStorage and try again

### Issue: Products Not Loading
**Error:** Homepage shows "Loading..." forever

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Verify API is accessible: http://localhost:8000/api/products/featured/
4. Check if TanStack Query is installed: `npm list @tanstack/react-query`

## Manual API Tests

### Test Products API
```bash
curl http://localhost:8000/api/products/
```

### Test Featured Products
```bash
curl http://localhost:8000/api/products/featured/
```

### Test Product Detail
```bash
curl http://localhost:8000/api/products/noir-bouquet/
```

### Test Collections
```bash
curl http://localhost:8000/api/collections/featured/
```

### Test Cart (replace SESSION_KEY)
```bash
curl http://localhost:8000/api/orders/cart/session_123456/
```

### Test Add to Cart
```bash
curl -X POST http://localhost:8000/api/orders/cart/session_123456/add_item/ \
  -H "Content-Type: application/json" \
  -d '{"product_id": "noir-bouquet", "quantity": 1}'
```

## Success Indicators

✅ Backend running on port 8000
✅ Frontend running on port 8080
✅ API docs accessible at /api/docs/
✅ Products visible in API response
✅ Cart API calls successful
✅ Session key stored in localStorage
✅ No CORS errors in console
✅ Network tab shows successful API calls

## Next Steps After Testing

Once everything is working:

1. Update pages to use API hooks (see `FRONTEND_BACKEND_CONNECTED.md`)
2. Test each page as you update it
3. Verify cart functionality end-to-end
4. Test checkout flow
5. Test order confirmation

## Need Help?

Check these files:
- `FRONTEND_BACKEND_CONNECTED.md` - Integration guide
- `back/API_REFERENCE.md` - API documentation
- `ARCHITECTURE.md` - System architecture
- Browser DevTools Console - Error messages
- Browser DevTools Network - API calls

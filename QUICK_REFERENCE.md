# Quick Reference Card

## 🚀 Start Servers

```bash
# Terminal 1 - Backend
cd back
python manage.py runserver

# Terminal 2 - Frontend  
cd front
npm run dev
```

## 🔗 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:8000/api/ |
| Admin Panel | http://localhost:8000/admin/ |
| API Docs | http://localhost:8000/api/docs/ |

## 📦 Import Statements

```typescript
// API Client
import { api } from '@/lib/api';

// React Hooks
import { useProducts, useProduct } from '@/hooks/useProducts';
import { useCollections, useCollection } from '@/hooks/useCollections';

// Cart
import { useCart } from '@/context/CartContext';

// Session
import { getSessionKey } from '@/lib/session';
```

## 🎣 React Hooks Usage

```typescript
// List products
const { data, isLoading, error } = useProducts({ search: 'rose' });

// Single product
const { data: product } = useProduct('noir-bouquet');

// Featured products
const { data: featured } = useFeaturedProducts();

// Collections
const { data: collections } = useFeaturedCollections();

// Cart
const { items, addItem, removeItem, updateQty, clear } = useCart();
```

## 🛒 Cart Operations

```typescript
// Add to cart
addItem({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  productId: product.id,
  variantId: variant?.id,
});

// Update quantity
updateQty(itemId, newQuantity);

// Remove item
removeItem(itemId);

// Clear cart
clear();
```

## 🔌 Direct API Calls

```typescript
// Products
const products = await api.products.list();
const product = await api.products.get('noir-bouquet');
const featured = await api.products.featured();
const results = await api.products.search('amber');

// Collections
const collections = await api.collections.list();
const collection = await api.collections.get('atelier');

// Cart
const sessionKey = getSessionKey();
const cart = await api.cart.get(sessionKey);
await api.cart.addItem(sessionKey, { product_id, quantity });

// Orders
const order = await api.orders.create(orderData);
```

## 📝 Common Patterns

### Loading State
```typescript
const { data, isLoading } = useProducts();

if (isLoading) return <div>Loading...</div>;
```

### Error Handling
```typescript
const { data, error } = useProducts();

if (error) return <div>Error: {error.message}</div>;
```

### Conditional Rendering
```typescript
const { data: products } = useProducts();

return (
  <div>
    {products?.results?.map(p => (
      <ProductCard key={p.id} product={p} />
    ))}
  </div>
);
```

## 🐛 Debug Commands

```bash
# Check backend data
curl http://localhost:8000/api/products/

# Check cart
curl http://localhost:8000/api/orders/cart/session_123/

# View logs
# Backend: Check terminal running Django
# Frontend: Check browser console (F12)
```

## 📊 Data Structure

### Product
```typescript
{
  id: string;
  name: string;
  slug: string;
  price: string; // "89.00"
  image: string;
  badge?: string;
  is_bestseller?: boolean;
}
```

### Product Detail
```typescript
{
  ...Product,
  description: string;
  story: string;
  rating: { average: number; count: number };
  gallery: string[];
  sizes: Array<{ id, label, volume, price, sku }>;
  accords: { top: [], heart: [], base: [] };
  highlights: Array<{ title, description }>;
  ritual: string[];
  ingredients: string[];
}
```

### Cart Item
```typescript
{
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  cartItemId?: number;
  productId?: string;
  variantId?: number;
}
```

## 🔧 Environment Variables

```env
# front/.env
VITE_API_BASE_URL=http://localhost:8000/api

# back/.env
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| `CONNECTION_COMPLETE.md` | Main guide |
| `FRONTEND_BACKEND_CONNECTED.md` | Integration details |
| `front/TEST_CONNECTION.md` | Testing guide |
| `back/API_REFERENCE.md` | API docs |
| `ARCHITECTURE.md` | System design |

## ⚡ Quick Fixes

### CORS Error
```bash
# Check back/.env has:
CORS_ALLOWED_ORIGINS=http://localhost:8080
# Restart backend
```

### Cart Not Working
```javascript
// Check session key in browser console
localStorage.getItem('cart_session_key')
```

### No Products
```bash
cd back
python manage.py populate_data
```

### Port Already in Use
```bash
# Backend (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Frontend (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

## 🎯 Update Checklist

- [ ] Homepage - Use `useFeaturedProducts()` and `useFeaturedCollections()`
- [ ] Shop - Use `useProducts()`
- [ ] Product Detail - Use `useProduct(slug)`
- [ ] Collection - Use `useCollection(slug)`
- [ ] Search - Use `useSearchProducts(query)`
- [x] Cart - Already connected! ✅
- [ ] Checkout - Use `api.orders.create()`
- [ ] Order Confirmation - Use `api.orders.get(orderId)`

## 💡 Pro Tips

1. **Use React Query hooks** instead of direct API calls for automatic caching
2. **Check Network tab** in DevTools to debug API calls
3. **Test one page at a time** - easier to debug
4. **Cart already works** - test it first to verify connection
5. **Use TypeScript** - API client has full type safety

---

**Need help?** Check `CONNECTION_COMPLETE.md` for detailed guide!

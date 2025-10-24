# Frontend-Backend Integration Checklist

## ✅ Backend Setup (Complete)

- [x] Django project created with 3 apps
- [x] 13 database models defined
- [x] REST API endpoints implemented
- [x] Admin panel configured
- [x] Sample data populated
- [x] CORS configured for localhost:8080
- [x] API documentation generated

## 🔄 Frontend Integration (To Do)

### 1. Environment Setup

- [ ] Add backend URL to frontend `.env`:
  ```env
  VITE_API_BASE_URL=http://localhost:8000/api
  ```

### 2. Create API Client

- [ ] Create `front/client/lib/api.ts` with API helper functions
- [ ] Add session key management for cart
- [ ] Configure fetch/axios with base URL

### 3. Update Context

- [ ] Modify `CartContext.tsx` to use backend API instead of localStorage
- [ ] Implement session-based cart with backend

### 4. Update Pages

#### Homepage (`front/client/pages/Index.tsx`)
- [ ] Replace hardcoded `FEATURED` array with API call to `/api/products/featured/`
- [ ] Replace `COLLECTION_CARDS` with API call to `/api/collections/featured/`

#### Shop Page (`front/client/pages/Shop.tsx`)
- [ ] Replace hardcoded `PRODUCTS` array with API call to `/api/products/`
- [ ] Implement search with `/api/products/search/?q=`
- [ ] Implement sorting with `?ordering=` parameter

#### Product Detail (`front/client/pages/Product.tsx`)
- [ ] Replace `PRODUCT_CATALOG` with API call to `/api/products/{slug}/`
- [ ] Replace `RELATED_PRODUCTS` with API call to `/api/products/{slug}/related/`
- [ ] Update "Add to Cart" to call `/api/orders/cart/{session}/add_item/`

#### Collection Page (`front/client/pages/Collection.tsx`)
- [ ] Replace `SAMPLE_PRODUCTS` with API call to `/api/collections/{slug}/`

#### Cart Page (`front/client/pages/Cart.tsx`)
- [ ] Fetch cart from `/api/orders/cart/{session}/`
- [ ] Update quantity with `/api/orders/cart/{session}/update_item/`
- [ ] Remove items with `/api/orders/cart/{session}/remove_item/`
- [ ] Clear cart with `/api/orders/cart/{session}/clear/`

#### Search Page (`front/client/pages/Search.tsx`)
- [ ] Replace mock results with API call to `/api/products/search/?q=`

#### Checkout Flow (`front/client/pages/checkout/`)
- [ ] **Review.tsx**: Implement order creation with `POST /api/orders/`
- [ ] Clear cart after successful order
- [ ] Redirect to confirmation page

#### Order Confirmation (`front/client/pages/OrderConfirmation.tsx`)
- [ ] Fetch order details from `/api/orders/{orderId}/`
- [ ] Display order information

### 5. Add React Query (Optional but Recommended)

- [ ] Install `@tanstack/react-query`
- [ ] Create query hooks for products, collections, cart
- [ ] Implement caching and automatic refetching

### 6. Error Handling

- [ ] Add error boundaries
- [ ] Handle API errors gracefully
- [ ] Show loading states
- [ ] Display user-friendly error messages

### 7. Testing

- [ ] Test product listing and filtering
- [ ] Test product detail page
- [ ] Test add to cart functionality
- [ ] Test cart operations (update, remove, clear)
- [ ] Test search functionality
- [ ] Test checkout flow end-to-end
- [ ] Test promo code validation
- [ ] Test order confirmation

## 📝 Code Examples

### API Client Setup

```typescript
// front/client/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = {
  products: {
    list: (params?: Record<string, string>) => 
      fetch(`${API_BASE_URL}/products/?${new URLSearchParams(params)}`).then(r => r.json()),
    
    get: (slug: string) => 
      fetch(`${API_BASE_URL}/products/${slug}/`).then(r => r.json()),
    
    featured: () => 
      fetch(`${API_BASE_URL}/products/featured/`).then(r => r.json()),
    
    search: (query: string) => 
      fetch(`${API_BASE_URL}/products/search/?q=${query}`).then(r => r.json()),
  },
  
  collections: {
    list: () => 
      fetch(`${API_BASE_URL}/collections/`).then(r => r.json()),
    
    get: (slug: string) => 
      fetch(`${API_BASE_URL}/collections/${slug}/`).then(r => r.json()),
    
    featured: () => 
      fetch(`${API_BASE_URL}/collections/featured/`).then(r => r.json()),
  },
  
  cart: {
    get: (sessionKey: string) => 
      fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/`).then(r => r.json()),
    
    addItem: (sessionKey: string, item: any) => 
      fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/add_item/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      }).then(r => r.json()),
    
    updateItem: (sessionKey: string, itemId: number, quantity: number) => 
      fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/update_item/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, quantity })
      }).then(r => r.json()),
    
    removeItem: (sessionKey: string, itemId: number) => 
      fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/remove_item/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId })
      }).then(r => r.json()),
    
    clear: (sessionKey: string) => 
      fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/clear/`, {
        method: 'POST'
      }).then(r => r.json()),
  },
  
  orders: {
    create: (orderData: any) => 
      fetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      }).then(r => r.json()),
    
    get: (orderId: string) => 
      fetch(`${API_BASE_URL}/orders/${orderId}/`).then(r => r.json()),
  },
};
```

### Session Key Helper

```typescript
// front/client/lib/session.ts
export function getSessionKey(): string {
  let sessionKey = localStorage.getItem('cart_session_key');
  if (!sessionKey) {
    sessionKey = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart_session_key', sessionKey);
  }
  return sessionKey;
}
```

### Example: Update Homepage

```typescript
// front/client/pages/Index.tsx
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Index() {
  const [featured, setFeatured] = useState([]);
  const [collections, setCollections] = useState([]);
  
  useEffect(() => {
    // Fetch featured products
    api.products.featured().then(setFeatured);
    
    // Fetch featured collections
    api.collections.featured().then(setCollections);
  }, []);
  
  // Rest of component...
}
```

### Example: Update Cart Context

```typescript
// front/client/context/CartContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getSessionKey } from '@/lib/session';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const sessionKey = getSessionKey();
  
  useEffect(() => {
    // Load cart from backend
    api.cart.get(sessionKey).then(setCart);
  }, [sessionKey]);
  
  const addItem = async (product, quantity = 1) => {
    const updatedCart = await api.cart.addItem(sessionKey, {
      product_id: product.id,
      variant_id: product.variantId,
      quantity
    });
    setCart(updatedCart);
  };
  
  const updateQty = async (itemId, quantity) => {
    const updatedCart = await api.cart.updateItem(sessionKey, itemId, quantity);
    setCart(updatedCart);
  };
  
  const removeItem = async (itemId) => {
    const updatedCart = await api.cart.removeItem(sessionKey, itemId);
    setCart(updatedCart);
  };
  
  const clear = async () => {
    const updatedCart = await api.cart.clear(sessionKey);
    setCart(updatedCart);
  };
  
  return (
    <CartContext.Provider value={{
      items: cart?.items || [],
      totalItems: cart?.total_items || 0,
      subtotal: cart?.subtotal || 0,
      addItem,
      updateQty,
      removeItem,
      clear
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
```

## 🚀 Quick Start

1. **Start Backend:**
   ```bash
   cd back
   python manage.py runserver
   ```

2. **Start Frontend:**
   ```bash
   cd front
   npm run dev
   ```

3. **Test API:**
   - Visit http://localhost:8000/api/docs/
   - Test endpoints in Swagger UI

4. **Integrate Frontend:**
   - Follow checklist above
   - Test each page as you integrate

## 📚 Documentation References

- Backend API: `back/API_REFERENCE.md`
- Integration Guide: `back/FRONTEND_INTEGRATION.md`
- Architecture: `ARCHITECTURE.md`
- Backend Setup: `back/README.md`

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend is running on port 8000
- Check `CORS_ALLOWED_ORIGINS` in `back/.env`
- Verify frontend is on port 8080

### 404 Errors
- Check API endpoint URLs
- Verify backend migrations are run
- Ensure sample data is populated

### Cart Not Persisting
- Check session key is stored in localStorage
- Verify cart API calls are using correct session key
- Check browser console for errors

## ✨ Next Steps After Integration

1. Add loading states and skeletons
2. Implement error boundaries
3. Add toast notifications
4. Optimize images
5. Add authentication (optional)
6. Implement wishlist feature
7. Add product reviews
8. Set up analytics
9. Prepare for production deployment

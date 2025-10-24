# Frontend Integration Guide

This guide shows how to integrate the Django backend with your React frontend.

## API Base URL

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

## Page-to-Endpoint Mapping

### 1. Homepage (`/`)

**Featured Products:**
```javascript
fetch(`${API_BASE_URL}/products/featured/`)
  .then(res => res.json())
  .then(data => setFeaturedProducts(data));
```

**Featured Collections:**
```javascript
fetch(`${API_BASE_URL}/collections/featured/`)
  .then(res => res.json())
  .then(data => setCollections(data));
```

### 2. Shop Page (`/shop`)

**All Products with Search:**
```javascript
const query = searchQuery ? `?search=${searchQuery}` : '';
fetch(`${API_BASE_URL}/products/${query}`)
  .then(res => res.json())
  .then(data => setProducts(data.results));
```

**With Sorting:**
```javascript
const ordering = sortBy === 'price-asc' ? 'price' : sortBy === 'price-desc' ? '-price' : '';
fetch(`${API_BASE_URL}/products/?ordering=${ordering}`)
  .then(res => res.json())
  .then(data => setProducts(data.results));
```

### 3. Product Detail Page (`/product/:slug`)

**Get Product by Slug:**
```javascript
fetch(`${API_BASE_URL}/products/${slug}/`)
  .then(res => res.json())
  .then(data => setProduct(data));
```

**Get Related Products:**
```javascript
fetch(`${API_BASE_URL}/products/${slug}/related/`)
  .then(res => res.json())
  .then(data => setRelatedProducts(data));
```

### 4. Collection Page (`/collection/:slug`)

**Get Collection with Products:**
```javascript
fetch(`${API_BASE_URL}/collections/${slug}/`)
  .then(res => res.json())
  .then(data => {
    setCollection(data);
    setProducts(data.products);
  });
```

### 5. Search Page (`/search?q=`)

**Search Products:**
```javascript
const query = new URLSearchParams(window.location.search).get('q');
fetch(`${API_BASE_URL}/products/search/?q=${query}`)
  .then(res => res.json())
  .then(data => setResults(data));
```

### 6. Cart Page (`/cart`)

**Get Cart:**
```javascript
const sessionKey = getSessionKey(); // Generate or retrieve from localStorage
fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/`)
  .then(res => res.json())
  .then(data => setCart(data));
```

**Add to Cart:**
```javascript
fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/add_item/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product_id: productId,
    variant_id: variantId,
    quantity: 1
  })
})
  .then(res => res.json())
  .then(data => setCart(data));
```

**Update Cart Item:**
```javascript
fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/update_item/`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    item_id: itemId,
    quantity: newQuantity
  })
})
  .then(res => res.json())
  .then(data => setCart(data));
```

**Remove from Cart:**
```javascript
fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/remove_item/`, {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ item_id: itemId })
})
  .then(res => res.json())
  .then(data => setCart(data));
```

### 7. Checkout Flow (`/checkout/*`)

**Validate Promo Code:**
```javascript
fetch(`${API_BASE_URL}/orders/promo/${code}/validate/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ subtotal: cartSubtotal })
})
  .then(res => res.json())
  .then(data => {
    if (data.valid) {
      setDiscount(data.discount_amount);
    }
  });
```

**Create Order:**
```javascript
fetch(`${API_BASE_URL}/orders/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: customerEmail,
    full_name: fullName,
    shipping_address: address,
    shipping_city: city,
    shipping_postal_code: postalCode,
    shipping_country: 'Ghana',
    payment_method: 'card',
    promo_code: promoCode,
    items: cartItems.map(item => ({
      product_id: item.product.id,
      variant_id: item.variant?.id,
      name: item.product.name,
      image: item.product.image,
      variant_label: item.variant?.label || '',
      quantity: item.quantity,
      price: item.price
    }))
  })
})
  .then(res => res.json())
  .then(order => {
    // Clear cart
    fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/clear/`, { method: 'POST' });
    // Redirect to confirmation
    navigate(`/order/${order.id}/confirmation`);
  });
```

### 8. Order Confirmation (`/order/:orderId/confirmation`)

**Get Order Details:**
```javascript
fetch(`${API_BASE_URL}/orders/${orderId}/`)
  .then(res => res.json())
  .then(data => setOrder(data));
```

## Helper Functions

### Session Key Management

```javascript
// utils/session.js
export function getSessionKey() {
  let sessionKey = localStorage.getItem('cart_session_key');
  if (!sessionKey) {
    sessionKey = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart_session_key', sessionKey);
  }
  return sessionKey;
}
```

### API Client

```javascript
// lib/api.js
const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Products
  getProducts: (params = {}) => 
    fetch(`${API_BASE_URL}/products/?${new URLSearchParams(params)}`).then(r => r.json()),
  
  getProduct: (slug) => 
    fetch(`${API_BASE_URL}/products/${slug}/`).then(r => r.json()),
  
  getFeaturedProducts: () => 
    fetch(`${API_BASE_URL}/products/featured/`).then(r => r.json()),
  
  searchProducts: (query) => 
    fetch(`${API_BASE_URL}/products/search/?q=${query}`).then(r => r.json()),
  
  getRelatedProducts: (slug) => 
    fetch(`${API_BASE_URL}/products/${slug}/related/`).then(r => r.json()),
  
  // Collections
  getCollections: () => 
    fetch(`${API_BASE_URL}/collections/`).then(r => r.json()),
  
  getCollection: (slug) => 
    fetch(`${API_BASE_URL}/collections/${slug}/`).then(r => r.json()),
  
  getFeaturedCollections: () => 
    fetch(`${API_BASE_URL}/collections/featured/`).then(r => r.json()),
  
  // Cart
  getCart: (sessionKey) => 
    fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/`).then(r => r.json()),
  
  addToCart: (sessionKey, item) => 
    fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/add_item/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).then(r => r.json()),
  
  updateCartItem: (sessionKey, itemId, quantity) => 
    fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/update_item/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: itemId, quantity })
    }).then(r => r.json()),
  
  removeFromCart: (sessionKey, itemId) => 
    fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/remove_item/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: itemId })
    }).then(r => r.json()),
  
  clearCart: (sessionKey) => 
    fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/clear/`, {
      method: 'POST'
    }).then(r => r.json()),
  
  // Orders
  createOrder: (orderData) => 
    fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    }).then(r => r.json()),
  
  getOrder: (orderId) => 
    fetch(`${API_BASE_URL}/orders/${orderId}/`).then(r => r.json()),
  
  // Promo Codes
  validatePromo: (code, subtotal) => 
    fetch(`${API_BASE_URL}/orders/promo/${code}/validate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subtotal })
    }).then(r => r.json()),
};
```

## React Query Integration

```javascript
// hooks/useProducts.js
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useProducts(params) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.getProducts(params),
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.getProduct(slug),
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.getFeaturedProducts(),
  });
}
```

## CORS Configuration

The backend is already configured to accept requests from:
- `http://localhost:8080`
- `http://127.0.0.1:8080`

If your frontend runs on a different port, update `CORS_ALLOWED_ORIGINS` in `back/.env`.

## Environment Variables

Add to your frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Then use it:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## Testing

1. Start the Django backend: `python manage.py runserver`
2. Start the React frontend: `npm run dev`
3. Test the integration by browsing products and adding items to cart

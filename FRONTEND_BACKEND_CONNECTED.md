# Frontend-Backend Connection Complete! 🎉

The frontend is now connected to the Django backend. Here's what was set up:

## ✅ What's Been Done

### 1. API Client Created
- **`front/client/lib/api.ts`** - Complete API client with all endpoints
- **`front/client/lib/session.ts`** - Session key management for cart
- TypeScript interfaces for type safety

### 2. React Hooks Created
- **`front/client/hooks/useProducts.ts`** - Product queries
- **`front/client/hooks/useCollections.ts`** - Collection queries
- Uses TanStack Query for caching and state management

### 3. Cart Context Updated
- **`front/client/context/CartContext.tsx`** - Now uses backend API
- Session-based cart (no auth required)
- Automatic cart loading on mount
- Real-time sync with backend

### 4. Environment Variables
- **`front/.env`** - Added `VITE_API_BASE_URL=http://localhost:8000/api`

## 🚀 How to Use

### Start Both Servers

**Terminal 1 - Backend:**
```bash
cd back
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd front
npm run dev
```

### Test the Connection

1. **Visit Frontend:** http://localhost:8080
2. **Check API:** http://localhost:8000/api/docs/
3. **Admin Panel:** http://localhost:8000/admin/

## 📝 Next Steps: Update Pages

The API client is ready, but you need to update the pages to use it. Here's how:

### Example 1: Update Homepage (Index.tsx)

**Before:**
```typescript
const FEATURED: Product[] = [
  { id: "noir-bouquet", name: "Noir Bouquet", price: 89, ... }
];
```

**After:**
```typescript
import { useFeaturedProducts } from '@/hooks/useProducts';
import { useFeaturedCollections } from '@/hooks/useCollections';

export default function Index() {
  const { data: featured, isLoading: loadingProducts } = useFeaturedProducts();
  const { data: collections, isLoading: loadingCollections } = useFeaturedCollections();
  
  if (loadingProducts || loadingCollections) {
    return <div>Loading...</div>;
  }
  
  // Use featured and collections data
  return (
    <main>
      {/* Your existing JSX, but use 'featured' instead of 'FEATURED' */}
    </main>
  );
}
```

### Example 2: Update Product Detail (Product.tsx)

**Before:**
```typescript
const product = PRODUCT_CATALOG[slug];
```

**After:**
```typescript
import { useProduct, useRelatedProducts } from '@/hooks/useProducts';

export default function Product() {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: related } = useRelatedProducts(slug);
  
  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;
  
  // Use product data
}
```

### Example 3: Update Shop Page (Shop.tsx)

**Before:**
```typescript
const PRODUCTS: Product[] = [...];
```

**After:**
```typescript
import { useProducts } from '@/hooks/useProducts';

export default function Shop() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  
  const { data, isLoading } = useProducts({
    search: query,
    ordering: sort === 'price-asc' ? 'price' : sort === 'price-desc' ? '-price' : ''
  });
  
  const products = data?.results || [];
  
  // Rest of component
}
```

### Example 4: Cart is Already Connected! ✅

The cart context is already updated and working with the backend. No changes needed!

```typescript
// This already works with backend
const { addItem } = useCart();

const handleAddToCart = () => {
  addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    productId: product.id,
    variantId: selectedVariant?.id,
  });
};
```

## 🔧 API Endpoints Available

### Products
```typescript
api.products.list({ search: 'rose', ordering: 'price' })
api.products.get('noir-bouquet')
api.products.featured()
api.products.bestsellers()
api.products.search('amber')
api.products.related('noir-bouquet')
```

### Collections
```typescript
api.collections.list()
api.collections.get('atelier-collection')
api.collections.featured()
```

### Cart (Already Integrated)
```typescript
api.cart.get(sessionKey)
api.cart.addItem(sessionKey, { product_id, variant_id, quantity })
api.cart.updateItem(sessionKey, itemId, quantity)
api.cart.removeItem(sessionKey, itemId)
api.cart.clear(sessionKey)
```

### Orders
```typescript
api.orders.create(orderData)
api.orders.get(orderId)
```

### Promo Codes
```typescript
api.promo.validate(code, subtotal)
```

## 📊 Data Transformation

The API client automatically transforms backend data to match your frontend types:

**Backend Response:**
```json
{
  "id": "noir-bouquet",
  "name": "Noir Bouquet",
  "price": "89.00",
  "image": "https://..."
}
```

**Frontend Type:**
```typescript
{
  id: "noir-bouquet",
  name: "Noir Bouquet",
  price: 89,  // Converted to number
  image: "https://..."
}
```

## 🎯 Quick Integration Checklist

- [x] API client created
- [x] Session management setup
- [x] React hooks created
- [x] Cart context updated
- [x] Environment variables configured
- [ ] Update Index.tsx to use API
- [ ] Update Shop.tsx to use API
- [ ] Update Product.tsx to use API
- [ ] Update Collection.tsx to use API
- [ ] Update Search.tsx to use API
- [ ] Update checkout flow to use API
- [ ] Update OrderConfirmation.tsx to use API

## 🐛 Troubleshooting

### CORS Errors
Make sure backend is running and CORS is configured:
```python
# back/config/settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
]
```

### Cart Not Loading
Check browser console for errors. Make sure:
1. Backend is running on port 8000
2. Frontend can reach `http://localhost:8000/api/`
3. Session key is being generated (check localStorage)

### Products Not Showing
1. Verify backend has data: `python manage.py populate_data`
2. Test API directly: http://localhost:8000/api/products/
3. Check browser network tab for API calls

## 📚 Documentation

- **API Reference:** `back/API_REFERENCE.md`
- **Backend Setup:** `back/README.md`
- **Architecture:** `ARCHITECTURE.md`

## 🎨 Example: Complete Page Update

Here's a complete example of updating the Shop page:

```typescript
// front/client/pages/Shop.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function Shop() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const { data, isLoading, error } = useProducts({
    search: query,
    ordering: sort === 'price-asc' ? 'price' : sort === 'price-desc' ? '-price' : ''
  });

  const products = data?.results || [];

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <main>
      <section className="container py-8 sm:py-12 animate-fade-up">
        <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-responsive-2xl font-bold">Shop</h1>
            <p className="mt-1 text-responsive-sm text-muted-foreground">Browse all products</p>
          </div>

          <div className="flex w-full max-w-md items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            <Button variant="outline" onClick={() => setQuery("")} size="sm">
              Clear
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="text-responsive-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${products.length} products`}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-md border bg-background px-2 py-1 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
```

## 🚀 You're Ready!

The connection is complete. Start updating your pages one by one, and test as you go. The cart already works with the backend, so you can test the full checkout flow once you update the product pages!

**Happy coding! 🎉**

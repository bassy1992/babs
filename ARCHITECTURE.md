# Full Stack Architecture

## Project Structure

```
fragrance-ecommerce/
├── front/                          # React + Vite Frontend
│   ├── client/
│   │   ├── pages/                  # 11 pages
│   │   │   ├── Index.tsx           → GET /api/products/featured/
│   │   │   ├── Shop.tsx            → GET /api/products/
│   │   │   ├── Product.tsx         → GET /api/products/{slug}/
│   │   │   ├── Collection.tsx      → GET /api/collections/{slug}/
│   │   │   ├── Cart.tsx            → GET /api/orders/cart/{session}/
│   │   │   ├── Search.tsx          → GET /api/products/search/
│   │   │   ├── OrderConfirmation   → GET /api/orders/{id}/
│   │   │   └── checkout/
│   │   │       ├── Checkout.tsx
│   │   │       ├── Shipping.tsx
│   │   │       ├── Payment.tsx
│   │   │       └── Review.tsx      → POST /api/orders/
│   │   ├── components/
│   │   └── context/
│   │       └── CartContext.tsx
│   └── package.json
│
└── back/                           # Django REST API Backend
    ├── config/                     # Django settings
    ├── products/                   # Products app
    │   ├── models.py               # 7 models
    │   ├── serializers.py
    │   ├── views.py                # ProductViewSet
    │   └── admin.py
    ├── collections/                # Collections app
    │   ├── models.py               # 1 model
    │   ├── serializers.py
    │   ├── views.py                # CollectionViewSet
    │   └── admin.py
    ├── orders/                     # Orders & Cart app
    │   ├── models.py               # 5 models
    │   ├── serializers.py
    │   ├── views.py                # OrderViewSet, CartViewSet
    │   └── admin.py
    └── manage.py
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                     http://localhost:8080                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Index   │  │   Shop   │  │ Product  │  │   Cart   │       │
│  │  Page    │  │   Page   │  │  Detail  │  │   Page   │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │              │              │              │
│       └─────────────┴──────────────┴──────────────┘              │
│                          │                                        │
│                    API Requests                                   │
│                          │                                        │
└──────────────────────────┼────────────────────────────────────────┘
                           │
                    CORS Enabled
                           │
┌──────────────────────────▼────────────────────────────────────────┐
│                      BACKEND (Django)                              │
│                   http://localhost:8000                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    REST API Endpoints                        │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  /api/products/              → ProductViewSet               │ │
│  │  /api/products/{slug}/       → Product Detail               │ │
│  │  /api/products/featured/     → Featured Products            │ │
│  │  /api/products/search/       → Search Products              │ │
│  │  /api/collections/           → CollectionViewSet            │ │
│  │  /api/collections/{slug}/    → Collection Detail            │ │
│  │  /api/orders/                → OrderViewSet                 │ │
│  │  /api/orders/cart/{key}/     → CartViewSet                  │ │
│  │  /api/orders/promo/{code}/   → PromoCodeViewSet             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Django ORM Layer                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   Database (SQLite)                          │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  • products_product                                          │ │
│  │  • products_productimage                                     │ │
│  │  • products_productvariant                                   │ │
│  │  • products_fragrancenote                                    │ │
│  │  • products_producthighlight                                 │ │
│  │  • products_ritualstep                                       │ │
│  │  • products_ingredient                                       │ │
│  │  • collections_collection                                    │ │
│  │  • orders_order                                              │ │
│  │  • orders_orderitem                                          │ │
│  │  • orders_cart                                               │ │
│  │  • orders_cartitem                                           │ │
│  │  • orders_promocode                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## API Integration Map

### Homepage Flow
```
User visits /
    ↓
Index.tsx loads
    ↓
Fetches: GET /api/products/featured/
         GET /api/collections/featured/
    ↓
Displays featured products & collections
```

### Product Detail Flow
```
User clicks product
    ↓
Navigate to /product/noir-bouquet
    ↓
Product.tsx loads
    ↓
Fetches: GET /api/products/noir-bouquet/
         GET /api/products/noir-bouquet/related/
    ↓
Displays product details, variants, notes
    ↓
User clicks "Add to Cart"
    ↓
POST /api/orders/cart/{session}/add_item/
    ↓
Cart updated
```

### Checkout Flow
```
User in Cart.tsx
    ↓
Clicks "Proceed to Checkout"
    ↓
Shipping.tsx → collects address
    ↓
Payment.tsx → collects payment info
    ↓
Review.tsx → shows order summary
    ↓
User clicks "Place Order"
    ↓
POST /api/orders/
    {
      email, full_name, address,
      payment_method, items[]
    }
    ↓
Backend calculates:
    - Subtotal
    - Shipping (free if >$150, else $12)
    - Tax (8%)
    - Discount (if promo code)
    - Total
    ↓
Creates Order & OrderItems
    ↓
Returns order ID
    ↓
POST /api/orders/cart/{session}/clear/
    ↓
Navigate to /order/{id}/confirmation
    ↓
GET /api/orders/{id}/
    ↓
Display confirmation
```

## Database Schema

```
Product (1) ──────< (N) ProductImage
    │
    ├──────< (N) ProductVariant
    │
    ├──────< (N) FragranceNote
    │
    ├──────< (N) ProductHighlight
    │
    ├──────< (N) RitualStep
    │
    └──────< (N) Ingredient

Collection (N) ────< (N) Product

Order (1) ──────< (N) OrderItem
    │
    └── references Product & ProductVariant

Cart (1) ──────< (N) CartItem
    │
    └── references Product & ProductVariant

PromoCode (standalone)
```

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite 7
- TailwindCSS
- Radix UI
- React Router v6
- TanStack Query
- Framer Motion
- Three.js

### Backend
- Django 5.0
- Django REST Framework 3.14
- SQLite (dev) / PostgreSQL (prod)
- CORS Headers
- drf-spectacular (API docs)

## Development Servers

```bash
# Frontend
cd front
npm run dev
# → http://localhost:8080

# Backend
cd back
python manage.py runserver
# → http://localhost:8000
```

## API Documentation

- Swagger UI: http://localhost:8000/api/docs/
- OpenAPI Schema: http://localhost:8000/api/schema/
- Django Admin: http://localhost:8000/admin/

## Key Features

✅ **11 Frontend Pages** fully mapped to backend endpoints
✅ **13 Database Models** with relationships
✅ **20+ API Endpoints** with filtering, search, pagination
✅ **Session-based Cart** (no auth required)
✅ **Order Management** with automatic calculations
✅ **Promo Code System** with validation
✅ **Admin Panel** for content management
✅ **Sample Data** pre-populated
✅ **API Documentation** auto-generated
✅ **CORS Configured** for local development

## Next Steps

1. Start both servers
2. Test API endpoints via Swagger UI
3. Update frontend to use backend API
4. Test full checkout flow
5. Add authentication (optional)
6. Deploy to production

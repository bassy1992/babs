# API Reference

Complete API documentation for the Fragrance E-commerce Backend.

## Base URL

```
http://localhost:8000/api
```

## Authentication

Currently, all endpoints are publicly accessible (AllowAny permission).
For production, implement authentication as needed.

---

## Products API

### List Products

**Endpoint:** `GET /products/`

**Query Parameters:**
- `search` - Search in name, description, story
- `ordering` - Sort by: `price`, `-price`, `created_at`, `-created_at`, `rating_average`, `name`
- `min_price` - Filter by minimum price
- `max_price` - Filter by maximum price
- `featured` - Filter featured products: `true`
- `bestseller` - Filter bestsellers: `true`
- `page` - Page number for pagination

**Response:**
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
    }
  ]
}
```

### Get Product Detail

**Endpoint:** `GET /products/{slug}/`

**Response:**
```json
{
  "id": "noir-bouquet",
  "name": "Noir Bouquet",
  "slug": "noir-bouquet",
  "description": "Velvety florals illuminated by...",
  "story": "Inspired by midnight garden salons...",
  "price": "89.00",
  "badge": "Bestseller",
  "is_featured": true,
  "is_bestseller": true,
  "rating": {
    "average": 4.8,
    "count": 312
  },
  "gallery": [
    "https://...",
    "https://..."
  ],
  "sizes": [
    {
      "id": 1,
      "label": "Extrait 50ml",
      "volume": "50ml",
      "price": "89.00",
      "sku": "NB-50",
      "stock": 100,
      "is_available": true
    }
  ],
  "accords": {
    "top": ["Italian bergamot", "Crushed fig leaf"],
    "heart": ["Velvet rose", "Saffron petal"],
    "base": ["Smoked amber", "Creamy sandalwood"]
  },
  "highlights": [
    {
      "id": 1,
      "title": "12-hour sillage",
      "description": "High concentration extrait...",
      "order": 0
    }
  ],
  "ritual": [
    "Mist once over hair to create a diffused trail.",
    "Layer with Velvet Evenings oil on pulse points for depth."
  ],
  "ingredients": [
    "Organic grain alcohol",
    "Rose absolute",
    "Fig leaf accord"
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Get Featured Products

**Endpoint:** `GET /products/featured/`

Returns up to 4 featured products.

### Get Bestsellers

**Endpoint:** `GET /products/bestsellers/`

Returns up to 4 bestseller products.

### Search Products

**Endpoint:** `GET /products/search/?q={query}`

**Query Parameters:**
- `q` - Search query

### Get Related Products

**Endpoint:** `GET /products/{slug}/related/`

Returns 3 related products (currently random, excluding the current product).

---

## Collections API

### List Collections

**Endpoint:** `GET /collections/`

**Response:**
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "title": "Atelier Collection",
      "slug": "atelier-collection",
      "description": "Limited extrait editions...",
      "image": "https://...",
      "href": "/collection/atelier-collection",
      "product_count": 2,
      "is_featured": true
    }
  ]
}
```

### Get Collection Detail

**Endpoint:** `GET /collections/{slug}/`

**Response:**
```json
{
  "id": 1,
  "title": "Atelier Collection",
  "slug": "atelier-collection",
  "description": "Limited extrait editions...",
  "image": "https://...",
  "product_count": 2,
  "is_featured": true,
  "products": [
    {
      "id": "noir-bouquet",
      "name": "Noir Bouquet",
      "slug": "noir-bouquet",
      "price": "89.00",
      "image": "https://...",
      "badge": "Bestseller",
      "is_bestseller": true
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Get Featured Collections

**Endpoint:** `GET /collections/featured/`

Returns up to 3 featured collections.

---

## Cart API

### Get Cart

**Endpoint:** `GET /orders/cart/{session_key}/`

**Response:**
```json
{
  "id": 1,
  "session_key": "session_123456",
  "total_items": 3,
  "subtotal": "267.00",
  "items": [
    {
      "id": 1,
      "product": {
        "id": "noir-bouquet",
        "name": "Noir Bouquet",
        "slug": "noir-bouquet",
        "price": "89.00",
        "image": "https://...",
        "badge": "Bestseller",
        "is_bestseller": true
      },
      "variant": 1,
      "quantity": 3,
      "price": "89.00",
      "subtotal": "267.00"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Add Item to Cart

**Endpoint:** `POST /orders/cart/{session_key}/add_item/`

**Request Body:**
```json
{
  "product_id": "noir-bouquet",
  "variant_id": 1,
  "quantity": 1
}
```

**Response:** Updated cart object

### Update Cart Item

**Endpoint:** `PATCH /orders/cart/{session_key}/update_item/`

**Request Body:**
```json
{
  "item_id": 1,
  "quantity": 2
}
```

**Response:** Updated cart object

### Remove Cart Item

**Endpoint:** `DELETE /orders/cart/{session_key}/remove_item/`

**Request Body:**
```json
{
  "item_id": 1
}
```

**Response:** Updated cart object

### Clear Cart

**Endpoint:** `POST /orders/cart/{session_key}/clear/`

**Response:** Empty cart object

---

## Orders API

### List Orders

**Endpoint:** `GET /orders/`

**Query Parameters:**
- `email` - Filter by customer email (for guest checkout)

**Response:**
```json
{
  "count": 1,
  "results": [
    {
      "id": "ORD123456",
      "email": "customer@example.com",
      "full_name": "John Doe",
      "status": "pending",
      "total": "299.00",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Order

**Endpoint:** `POST /orders/`

**Request Body:**
```json
{
  "email": "customer@example.com",
  "full_name": "John Doe",
  "shipping_address": "123 Main St",
  "shipping_city": "Accra",
  "shipping_postal_code": "00233",
  "shipping_country": "Ghana",
  "payment_method": "card",
  "promo_code": "WELCOME10",
  "items": [
    {
      "product_id": "noir-bouquet",
      "variant_id": 1,
      "name": "Noir Bouquet (50ml)",
      "image": "https://...",
      "variant_label": "Extrait 50ml",
      "quantity": 1,
      "price": 89.00
    }
  ]
}
```

**Response:**
```json
{
  "id": "ORD123456",
  "email": "customer@example.com",
  "full_name": "John Doe",
  "shipping_address": "123 Main St",
  "shipping_city": "Accra",
  "shipping_postal_code": "00233",
  "shipping_country": "Ghana",
  "status": "pending",
  "subtotal": "89.00",
  "shipping_cost": "12.00",
  "tax": "7.12",
  "discount_amount": "8.90",
  "total": "99.22",
  "payment_method": "card",
  "payment_status": "pending",
  "promo_code": "WELCOME10",
  "items": [
    {
      "id": 1,
      "product_name": "Noir Bouquet (50ml)",
      "product_image": "https://...",
      "variant_label": "Extrait 50ml",
      "quantity": 1,
      "price": "89.00",
      "subtotal": "89.00"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "notes": ""
}
```

### Get Order Detail

**Endpoint:** `GET /orders/{order_id}/`

Returns full order details.

### Get Order Confirmation

**Endpoint:** `GET /orders/{order_id}/confirmation/`

Same as order detail, used for confirmation page.

---

## Promo Codes API

### Get Promo Code

**Endpoint:** `GET /orders/promo/{code}/`

**Response:**
```json
{
  "code": "WELCOME10",
  "description": "10% off your first order",
  "discount_type": "percentage",
  "discount_value": "10.00",
  "min_purchase": "50.00",
  "is_valid": true
}
```

### Validate Promo Code

**Endpoint:** `POST /orders/promo/{code}/validate/`

**Request Body:**
```json
{
  "subtotal": 89.00
}
```

**Success Response:**
```json
{
  "valid": true,
  "promo": {
    "code": "WELCOME10",
    "description": "10% off your first order",
    "discount_type": "percentage",
    "discount_value": "10.00",
    "min_purchase": "50.00",
    "is_valid": true
  },
  "discount_amount": 8.90
}
```

**Error Response:**
```json
{
  "valid": false,
  "message": "Promo code is not valid or has expired"
}
```

---

## Pricing Calculation

### Shipping
- Free shipping on orders over $150
- Otherwise: $12 flat rate

### Tax
- 8% of subtotal

### Total Calculation
```
total = subtotal + shipping_cost + tax - discount_amount
```

---

## Error Responses

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 400 Bad Request
```json
{
  "error": "Product not found"
}
```

---

## Pagination

List endpoints return paginated results:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/products/?page=2",
  "previous": null,
  "results": [...]
}
```

Default page size: 20 items

---

## Interactive Documentation

Visit `http://localhost:8000/api/docs/` for interactive Swagger UI documentation where you can test all endpoints.

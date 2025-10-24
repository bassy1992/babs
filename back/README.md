# Fragrance E-commerce Backend

Django REST API backend for the luxury fragrance e-commerce platform.

## Features

- **Products API**: Full CRUD for fragrance products with variants, notes, and details
- **Collections API**: Product collections and categories
- **Orders API**: Order management and checkout flow
- **Cart API**: Session-based shopping cart
- **Promo Codes**: Discount code validation and application
- **Admin Panel**: Django admin for content management
- **API Documentation**: Auto-generated Swagger/OpenAPI docs

## Tech Stack

- Django 5.0
- Django REST Framework
- SQLite (development) / PostgreSQL (production)
- CORS headers for frontend integration
- drf-spectacular for API documentation

## Setup

### 1. Create Virtual Environment

```bash
cd back
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Populate Sample Data

```bash
python manage.py populate_data
```

### 7. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{slug}/` - Get product details
- `GET /api/products/featured/` - Get featured products
- `GET /api/products/bestsellers/` - Get bestseller products
- `GET /api/products/search/?q=query` - Search products
- `GET /api/products/{slug}/related/` - Get related products

### Collections
- `GET /api/collections/` - List all collections
- `GET /api/collections/{slug}/` - Get collection details
- `GET /api/collections/featured/` - Get featured collections

### Orders
- `GET /api/orders/` - List orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details
- `GET /api/orders/{id}/confirmation/` - Get order confirmation

### Cart
- `GET /api/orders/cart/{session_key}/` - Get cart
- `POST /api/orders/cart/{session_key}/add_item/` - Add item to cart
- `PATCH /api/orders/cart/{session_key}/update_item/` - Update cart item
- `DELETE /api/orders/cart/{session_key}/remove_item/` - Remove cart item
- `POST /api/orders/cart/{session_key}/clear/` - Clear cart

### Promo Codes
- `GET /api/orders/promo/{code}/` - Get promo code details
- `POST /api/orders/promo/{code}/validate/` - Validate promo code

## API Documentation

Visit `http://localhost:8000/api/docs/` for interactive Swagger UI documentation.

## Admin Panel

Access the Django admin at `http://localhost:8000/admin/` with your superuser credentials.

## Project Structure

```
back/
├── config/              # Django settings and configuration
├── products/            # Products app (models, views, serializers)
├── collections/         # Collections app
├── orders/              # Orders and cart app
├── manage.py
└── requirements.txt
```

## Models

### Product
- Basic info (name, description, price)
- Images gallery
- Variants (sizes/volumes)
- Fragrance notes (top, heart, base)
- Highlights and features
- Ritual steps
- Ingredients
- Ratings

### Collection
- Title, description, image
- Associated products
- Featured flag

### Order
- Customer information
- Shipping address
- Order items
- Payment details
- Status tracking

### Cart
- Session-based cart
- Cart items with quantities
- Automatic total calculation

### PromoCode
- Discount codes
- Percentage or fixed amount
- Validation rules
- Usage tracking

## Development

### Create New App

```bash
python manage.py startapp app_name
```

### Make Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Run Tests

```bash
python manage.py test
```

## Deployment

For production deployment:

1. Set `DEBUG=False` in `.env`
2. Update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`
3. Use PostgreSQL database
4. Collect static files: `python manage.py collectstatic`
5. Use a production WSGI server (gunicorn, uwsgi)

## License

MIT

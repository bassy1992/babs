# Design Document

## Overview

The Django REST Framework backend will provide a comprehensive API for the luxury fragrance e-commerce platform. The system follows a clean architecture pattern with clear separation between models, serializers, views, and business logic. The API will support the React frontend's requirements for product browsing, cart management, user authentication, order processing, and administrative functions.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Django REST    │────│   PostgreSQL    │
│   (Frontend)    │    │   Framework     │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │   Redis Cache   │
                       │   (Sessions)    │
                       └─────────────────┘
```

### Project Structure

```
back/
├── fragrance_api/
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── products/
│   ├── users/
│   ├── cart/
│   ├── orders/
│   ├── reviews/
│   └── common/
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
└── manage.py
```

### Technology Stack

- **Framework**: Django 4.2+ with Django REST Framework 3.14+
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Authentication**: JWT tokens using djangorestframework-simplejwt
- **File Storage**: Django's default file handling (with S3 support for production)
- **API Documentation**: drf-spectacular (OpenAPI 3.0)
- **Testing**: pytest with pytest-django

## Components and Interfaces

### Core Applications

#### 1. Products App

**Models:**
- `Category`: Product categories/collections
- `Product`: Main product information
- `ProductVariant`: Size/volume variants with pricing
- `ProductImage`: Multiple images per product
- `FragranceNote`: Top, heart, and base notes

**Key Endpoints:**
- `GET /api/products/` - List products with filtering and search
- `GET /api/products/{id}/` - Product detail with variants
- `GET /api/categories/` - List categories/collections
- `GET /api/categories/{slug}/products/` - Products by category

#### 2. Users App

**Models:**
- `User`: Extended Django user model
- `UserProfile`: Additional user information

**Key Endpoints:**
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User authentication
- `POST /api/auth/refresh/` - Token refresh
- `GET /api/users/profile/` - User profile
- `PUT /api/users/profile/` - Update profile

#### 3. Cart App

**Models:**
- `Cart`: User's shopping cart
- `CartItem`: Items in cart with quantities

**Key Endpoints:**
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/items/` - Add item to cart
- `PUT /api/cart/items/{id}/` - Update cart item
- `DELETE /api/cart/items/{id}/` - Remove cart item

#### 4. Orders App

**Models:**
- `Order`: Order header information
- `OrderItem`: Individual items in order
- `ShippingAddress`: Delivery information

**Key Endpoints:**
- `POST /api/orders/` - Create new order
- `GET /api/orders/` - List user's orders
- `GET /api/orders/{id}/` - Order details

#### 5. Reviews App

**Models:**
- `Review`: Product reviews and ratings

**Key Endpoints:**
- `GET /api/products/{id}/reviews/` - Product reviews
- `POST /api/products/{id}/reviews/` - Create review
- `PUT /api/reviews/{id}/` - Update review

### Authentication & Permissions

**Authentication Strategy:**
- JWT tokens for stateless authentication
- Access tokens (15 minutes) + Refresh tokens (7 days)
- Token blacklisting for logout functionality

**Permission Classes:**
- `IsAuthenticated`: For cart, orders, reviews
- `IsOwnerOrReadOnly`: For user profiles, reviews
- `IsAdminUser`: For administrative endpoints

### API Design Patterns

**Response Format:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "errors": null
}
```

**Pagination:**
```json
{
  "count": 150,
  "next": "http://api.example.com/products/?page=3",
  "previous": "http://api.example.com/products/?page=1",
  "results": [...]
}
```

**Error Handling:**
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

## Data Models

### Product Model Schema

```python
class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    story = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Fragrance-specific fields
    top_notes = models.JSONField(default=list)
    heart_notes = models.JSONField(default=list)
    base_notes = models.JSONField(default=list)
    
    # SEO and metadata
    meta_title = models.CharField(max_length=60, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
```

### ProductVariant Model Schema

```python
class ProductVariant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    product = models.ForeignKey(Product, related_name='variants')
    volume = models.CharField(max_length=20)  # "50ml", "100ml"
    label = models.CharField(max_length=100)  # "Extrait 50ml"
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
```

### Order Model Schema

```python
class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    order_number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=Status.choices)
    
    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## Error Handling

### Exception Handling Strategy

**Custom Exception Classes:**
- `ProductNotFound`: When product doesn't exist
- `InsufficientStock`: When variant is out of stock
- `InvalidCartOperation`: For cart-related errors
- `OrderProcessingError`: For order creation failures

**Global Exception Handler:**
```python
def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response_data = {
            'success': False,
            'data': None,
            'message': get_error_message(exc),
            'errors': response.data
        }
        response.data = custom_response_data
    
    return response
```

### Validation Strategy

**Serializer Validation:**
- Field-level validation for data types and formats
- Object-level validation for business rules
- Custom validators for complex requirements

**Business Logic Validation:**
- Stock availability checks before cart operations
- Price consistency validation
- User permission verification

## Testing Strategy

### Test Coverage Areas

**Unit Tests:**
- Model methods and properties
- Serializer validation logic
- Custom utility functions
- Business logic in services

**Integration Tests:**
- API endpoint functionality
- Database operations
- Authentication flows
- Cart and order workflows

**Performance Tests:**
- API response times
- Database query optimization
- Pagination efficiency
- Search functionality performance

### Test Data Management

**Fixtures:**
- Base product catalog for testing
- User accounts with different roles
- Sample orders and cart data

**Factory Classes:**
- ProductFactory for generating test products
- UserFactory for test users
- OrderFactory for test orders

### Testing Tools

- **pytest**: Primary testing framework
- **factory_boy**: Test data generation
- **pytest-django**: Django-specific testing utilities
- **pytest-cov**: Coverage reporting
- **django-test-plus**: Enhanced testing utilities






### API Security

- CORS configuration for frontend domain
- Request rate limiting per user/IP
- Input validation and sanitization
- SQL injection prevention through ORM

### Data Protection

- Sensitive data encryption at rest
- PII handling compliance
- Secure file upload validation
- Database connection security

## Performance Optimization

### Database Optimization

- Proper indexing on frequently queried fields
- Query optimization with select_related/prefetch_related
- Database connection pooling
- Read replica support for scaling

### Caching Strategy

- Redis caching for frequently accessed data
- Product catalog caching with cache invalidation
- Session storage in Redis
- API response caching for static data

### API Performance

- Pagination for large datasets
- Efficient serialization
- Background task processing for heavy operations
- CDN integration for static assets

## Deployment Architecture

### Environment Configuration

**Development:**
- SQLite database for local development
- Debug mode enabled
- Detailed error logging
- Hot reload for development

**Production:**
- PostgreSQL database
- Redis for caching and sessions
- Gunicorn WSGI server
- Nginx reverse proxy
- SSL/TLS termination

### Monitoring and Logging

- Application performance monitoring
- Error tracking and alerting
- Database performance monitoring
- API usage analytics
- Security event logging
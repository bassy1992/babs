# Babs - Luxury Fragrance E-commerce Platform 🇬🇭

A full-stack e-commerce platform for luxury fragrances, built with React and Django, featuring Paystack payment integration for Ghana.

## 🚀 Features

### Frontend (React + Vite)
- 11 responsive pages with modern UI
- Product catalog with search and filtering
- Shopping cart with real-time updates
- Multi-step checkout flow
- Paystack payment integration
- Product detail pages with variants
- Collection browsing
- About page

### Backend (Django REST API)
- RESTful API with Django REST Framework
- Product management with variants, notes, and details
- Order processing and management
- Session-based shopping cart
- Promo code system
- Paystack payment integration
- Admin panel for content management
- API documentation (Swagger)

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite 7
- TailwindCSS + Radix UI
- React Router v6
- TanStack Query
- Framer Motion
- Three.js

### Backend
- Django 5.0
- Django REST Framework 3.14
- SQLite (dev) / PostgreSQL (prod)
- Paystack API
- CORS Headers
- drf-spectacular

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Git

### Backend Setup

```bash
cd back

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Populate sample data
python manage.py populate_data

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
cd front

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔑 Environment Variables

### Backend (`back/.env`)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080

# Paystack (Ghana)
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
```

### Frontend (`front/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🚀 Running the Application

1. **Start Backend:**
   ```bash
   cd back
   python manage.py runserver
   ```
   Backend runs at: http://localhost:8000

2. **Start Frontend:**
   ```bash
   cd front
   npm run dev
   ```
   Frontend runs at: http://localhost:8080

## 📱 Pages

- `/` - Homepage with featured products
- `/shop` - Product listing with search and filters
- `/product/:slug` - Product detail page
- `/collection/:slug` - Collection page
- `/cart` - Shopping cart
- `/checkout` - Multi-step checkout
- `/about` - About page
- `/order/:id/confirmation` - Order confirmation

## 💳 Payment Integration

Integrated with Paystack for Ghana, supporting:
- Debit/Credit Cards (Visa, Mastercard, Verve)
- Mobile Money (MTN, Vodafone, AirtelTigo)
- Bank Transfer
- USSD

## 🔐 Admin Panel

Access at: http://localhost:8000/admin/

Manage:
- Products with variants, images, notes
- Collections
- Orders
- Shopping carts
- Promo codes

## 📚 API Documentation

Interactive API docs: http://localhost:8000/api/docs/

## 🧪 Testing

### Backend
```bash
cd back
python manage.py test
```

### Frontend
```bash
cd front
npm run test
```

## 📖 Documentation

- `ARCHITECTURE.md` - System architecture
- `PAYSTACK_SETUP.md` - Payment integration guide
- `back/API_REFERENCE.md` - Complete API documentation
- `INTEGRATION_CHECKLIST.md` - Frontend-backend integration

## 🌍 Deployment

### Backend (Production)
1. Set `DEBUG=False`
2. Configure PostgreSQL
3. Set proper `SECRET_KEY`
4. Update `ALLOWED_HOSTS`
5. Use Paystack live keys
6. Collect static files: `python manage.py collectstatic`
7. Use gunicorn/uwsgi

### Frontend (Production)
1. Update API base URL
2. Build: `npm run build`
3. Deploy `dist/` folder
4. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License

## 👥 Team

Built with ❤️ for luxury fragrance e-commerce in Ghana

## 🆘 Support

For issues and questions, check the documentation files or open an issue.

---

**Made in Ghana 🇬🇭**

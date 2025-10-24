# Quick Start Guide

## Windows Setup

1. **Run the setup script:**
   ```cmd
   setup.bat
   ```

2. **Create admin user:**
   ```cmd
   python manage.py createsuperuser
   ```

3. **Start the server:**
   ```cmd
   python manage.py runserver
   ```

4. **Access the API:**
   - API: http://localhost:8000/api/
   - Admin: http://localhost:8000/admin/
   - Docs: http://localhost:8000/api/docs/

## Mac/Linux Setup

1. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Create admin user:**
   ```bash
   python manage.py createsuperuser
   ```

3. **Start the server:**
   ```bash
   python manage.py runserver
   ```

4. **Access the API:**
   - API: http://localhost:8000/api/
   - Admin: http://localhost:8000/admin/
   - Docs: http://localhost:8000/api/docs/

## Testing the API

### Get all products:
```bash
curl http://localhost:8000/api/products/
```

### Get product by slug:
```bash
curl http://localhost:8000/api/products/noir-bouquet/
```

### Get featured products:
```bash
curl http://localhost:8000/api/products/featured/
```

### Search products:
```bash
curl http://localhost:8000/api/products/search/?q=rose
```

### Get collections:
```bash
curl http://localhost:8000/api/collections/
```

## Frontend Integration

Update your frontend API calls to point to:
```
http://localhost:8000/api/
```

Example with fetch:
```javascript
// Get all products
const response = await fetch('http://localhost:8000/api/products/');
const products = await response.json();

// Get product details
const product = await fetch('http://localhost:8000/api/products/noir-bouquet/');
const productData = await product.json();
```

## Sample Data

The database is pre-populated with:
- 4 fragrance products (Noir Bouquet, Rose Velours, Amber Dusk, Citrus Bloom)
- 3 collections (Atelier Collection, Botanical Library, Velvet Evenings)
- Product variants, notes, highlights, and ingredients

## Next Steps

1. Explore the admin panel to manage products
2. Test the API endpoints with the Swagger docs
3. Integrate with your React frontend
4. Customize models and add more features as needed

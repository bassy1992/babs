# Create Superuser

The naming conflict has been fixed! The `collections` app has been renamed to `product_collections` to avoid conflicts with Python's built-in `collections` module.

## Create Admin User

Run this command and follow the prompts:

```bash
python manage.py createsuperuser
```

You'll be asked for:
- Username (e.g., admin)
- Email address (optional, can press Enter to skip)
- Password (type it twice)

## Start the Server

```bash
python manage.py runserver
```

## Access Points

- **API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/
- **API Docs**: http://localhost:8000/api/docs/

## What Was Fixed

The error occurred because Python was trying to import from the standard library `collections` module but found our Django app folder instead. 

**Changes made:**
- Renamed `collections/` → `product_collections/`
- Updated model name: `Collection` → `ProductCollection`
- Updated all imports and references
- Migrations created and applied
- Sample data populated

Everything is now working correctly!

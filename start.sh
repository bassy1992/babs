#!/bin/bash
set -e  # Stop if any command fails

cd back  # go into Django backend

# Apply migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}

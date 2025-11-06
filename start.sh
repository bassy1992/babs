#!/bin/bash
set -e

cd back
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python -m gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}

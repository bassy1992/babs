#!/bin/bash
set -e

cd back
python3 manage.py migrate --noinput
python3 manage.py collectstatic --noinput
python3 -m gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}

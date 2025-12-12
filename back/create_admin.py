#!/usr/bin/env python
"""
Create a superuser for Railway deployment
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create superuser
username = 'admin'
email = 'admin@babsfragrance.com'
password = 'BabsAdmin2024!'

if User.objects.filter(username=username).exists():
    print(f"User '{username}' already exists")
else:
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"✓ Superuser created successfully!")
    print(f"Username: {username}")
    print(f"Password: {password}")
    print(f"Email: {email}")

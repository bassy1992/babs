#!/usr/bin/env python
"""
Delete all superusers from the database
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Delete all superusers
superusers = User.objects.filter(is_superuser=True)
count = superusers.count()

if count > 0:
    superusers.delete()
    print(f"✓ Deleted {count} superuser(s)")
else:
    print("No superusers found")

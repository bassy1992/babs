#!/usr/bin/env python
"""
Generate a new Django SECRET_KEY for production use.
Run this script and copy the output to your Railway environment variables.
"""

from django.core.management.utils import get_random_secret_key

if __name__ == "__main__":
    secret_key = get_random_secret_key()
    print("\n" + "="*60)
    print("🔑 Generated Django SECRET_KEY for Production")
    print("="*60)
    print(f"\n{secret_key}\n")
    print("="*60)
    print("\n📋 Copy this key to your Railway environment variables:")
    print("   Variable name: SECRET_KEY")
    print(f"   Value: {secret_key}")
    print("\n⚠️  Keep this key secret and never commit it to Git!")
    print("="*60 + "\n")

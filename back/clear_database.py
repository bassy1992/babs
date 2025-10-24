"""
Script to clear all data from the database
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Product, ProductVariant, ProductHighlight
from product_collections.models import ProductCollection
from orders.models import Order, OrderItem, Cart, CartItem, PromoCode

def clear_all_data():
    print("Clearing all data from database...")
    
    # Delete in order to respect foreign key constraints
    print("Deleting order items...")
    OrderItem.objects.all().delete()
    
    print("Deleting orders...")
    Order.objects.all().delete()
    
    print("Deleting cart items...")
    CartItem.objects.all().delete()
    
    print("Deleting carts...")
    Cart.objects.all().delete()
    
    print("Deleting promo codes...")
    PromoCode.objects.all().delete()
    
    print("Deleting product highlights...")
    ProductHighlight.objects.all().delete()
    
    print("Deleting product variants...")
    ProductVariant.objects.all().delete()
    
    print("Deleting products...")
    Product.objects.all().delete()
    
    print("Deleting collections...")
    ProductCollection.objects.all().delete()
    
    print("\n✓ All data cleared successfully!")
    print("\nDatabase counts:")
    print(f"  Products: {Product.objects.count()}")
    print(f"  Collections: {ProductCollection.objects.count()}")
    print(f"  Orders: {Order.objects.count()}")
    print(f"  Carts: {Cart.objects.count()}")
    print(f"  Promo Codes: {PromoCode.objects.count()}")

if __name__ == '__main__':
    confirm = input("Are you sure you want to delete ALL data? Type 'yes' to confirm: ")
    if confirm.lower() == 'yes':
        clear_all_data()
    else:
        print("Operation cancelled.")

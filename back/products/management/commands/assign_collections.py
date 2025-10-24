from django.core.management.base import BaseCommand
from products.models import Product
from product_collections.models import ProductCollection
import random


class Command(BaseCommand):
    help = 'Assign products to collections (brands)'

    def handle(self, *args, **options):
        products = Product.objects.filter(collection__isnull=True)
        collections = list(ProductCollection.objects.filter(is_active=True))
        
        if not collections:
            self.stdout.write(self.style.ERROR('No collections found. Run load_signature_collections first.'))
            return
        
        if not products.exists():
            self.stdout.write(self.style.WARNING('All products already have collections assigned.'))
            return
        
        updated_count = 0
        for product in products:
            # Randomly assign to a collection
            collection = random.choice(collections)
            product.collection = collection
            product.save()
            updated_count += 1
            self.stdout.write(
                self.style.SUCCESS(f'Assigned {product.name} to {collection.title}')
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'\nCompleted! Assigned {updated_count} products to collections.')
        )

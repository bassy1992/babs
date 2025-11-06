from django.core.management.base import BaseCommand
from products.models import Product
from product_collections.models import ProductCollection


class Command(BaseCommand):
    help = 'Populate database with sample fragrance products'

    def handle(self, *args, **kwargs):
        # Create collections
        collections_data = [
            {'name': 'Luxury Collection', 'description': 'Premium luxury fragrances'},
            {'name': 'Fresh & Clean', 'description': 'Light and refreshing scents'},
            {'name': 'Oriental Spice', 'description': 'Warm and exotic fragrances'},
        ]

        collections = {}
        for coll_data in collections_data:
            collection, created = ProductCollection.objects.get_or_create(
                name=coll_data['name'],
                defaults={'description': coll_data['description']}
            )
            collections[coll_data['name']] = collection
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created collection: {collection.name}'))

        # Create sample products
        products_data = [
            {
                'name': 'Midnight Oud',
                'description': 'A luxurious blend of oud wood and amber, perfect for evening wear.',
                'price': 89.99,
                'stock': 50,
                'collection': 'Luxury Collection',
            },
            {
                'name': 'Ocean Breeze',
                'description': 'Fresh aquatic notes with hints of citrus and sea salt.',
                'price': 49.99,
                'stock': 100,
                'collection': 'Fresh & Clean',
            },
            {
                'name': 'Spice Market',
                'description': 'Warm cardamom and cinnamon with a touch of vanilla.',
                'price': 69.99,
                'stock': 75,
                'collection': 'Oriental Spice',
            },
            {
                'name': 'Rose Garden',
                'description': 'Delicate rose petals with jasmine and white musk.',
                'price': 79.99,
                'stock': 60,
                'collection': 'Luxury Collection',
            },
            {
                'name': 'Citrus Splash',
                'description': 'Energizing blend of lemon, bergamot, and grapefruit.',
                'price': 39.99,
                'stock': 120,
                'collection': 'Fresh & Clean',
            },
            {
                'name': 'Amber Nights',
                'description': 'Rich amber with notes of sandalwood and patchouli.',
                'price': 94.99,
                'stock': 40,
                'collection': 'Oriental Spice',
            },
        ]

        for product_data in products_data:
            collection_name = product_data.pop('collection')
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults={
                    **product_data,
                    'collection': collections[collection_name]
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Product already exists: {product.name}'))

        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully populated database!'))
        self.stdout.write(self.style.SUCCESS(f'Total products: {Product.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Total collections: {ProductCollection.objects.count()}'))

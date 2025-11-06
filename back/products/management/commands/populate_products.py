from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Product
from product_collections.models import ProductCollection


class Command(BaseCommand):
    help = 'Populate database with sample fragrance products'

    def handle(self, *args, **kwargs):
        # Create collections
        collections_data = [
            {
                'title': 'Luxury Collection',
                'description': 'Premium luxury fragrances for the discerning individual',
                'image': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'
            },
            {
                'title': 'Fresh & Clean',
                'description': 'Light and refreshing scents for everyday wear',
                'image': 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800'
            },
            {
                'title': 'Oriental Spice',
                'description': 'Warm and exotic fragrances with rich depth',
                'image': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'
            },
        ]

        collections = {}
        for coll_data in collections_data:
            collection, created = ProductCollection.objects.get_or_create(
                title=coll_data['title'],
                defaults={
                    'description': coll_data['description'],
                    'image': coll_data['image']
                }
            )
            collections[coll_data['title']] = collection
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created collection: {collection.title}'))

        # Create sample products
        products_data = [
            {
                'id': 'midnight-oud',
                'name': 'Midnight Oud',
                'description': 'A luxurious blend of oud wood and amber, perfect for evening wear.',
                'price': 89.99,
                'collection': 'Luxury Collection',
            },
            {
                'id': 'ocean-breeze',
                'name': 'Ocean Breeze',
                'description': 'Fresh aquatic notes with hints of citrus and sea salt.',
                'price': 49.99,
                'collection': 'Fresh & Clean',
            },
            {
                'id': 'spice-market',
                'name': 'Spice Market',
                'description': 'Warm cardamom and cinnamon with a touch of vanilla.',
                'price': 69.99,
                'collection': 'Oriental Spice',
            },
            {
                'id': 'rose-garden',
                'name': 'Rose Garden',
                'description': 'Delicate rose petals with jasmine and white musk.',
                'price': 79.99,
                'collection': 'Luxury Collection',
            },
            {
                'id': 'citrus-splash',
                'name': 'Citrus Splash',
                'description': 'Energizing blend of lemon, bergamot, and grapefruit.',
                'price': 39.99,
                'collection': 'Fresh & Clean',
            },
            {
                'id': 'amber-nights',
                'name': 'Amber Nights',
                'description': 'Rich amber with notes of sandalwood and patchouli.',
                'price': 94.99,
                'collection': 'Oriental Spice',
            },
        ]

        for product_data in products_data:
            collection_name = product_data.pop('collection')
            product, created = Product.objects.get_or_create(
                id=product_data['id'],
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

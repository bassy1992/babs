from django.core.management.base import BaseCommand
from product_collections.models import ProductCollection


class Command(BaseCommand):
    help = 'Load signature collections - curated capsules inspired by painterly cities, botanical archives, and twilight rituals'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear all existing collections before loading',
        )

    def handle(self, *args, **options):
        if options['clear']:
            # First, unassign all products from collections
            from products.models import Product
            product_count = Product.objects.filter(collection__isnull=False).count()
            Product.objects.all().update(collection=None)
            self.stdout.write(
                self.style.WARNING(f'Unassigned {product_count} products from collections')
            )
            
            # Now delete all collections
            deleted_count = ProductCollection.objects.all().count()
            ProductCollection.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing collections')
            )

        collections_data = [
            {
                'title': 'Atelier Collection',
                'description': 'Curated fragrances inspired by painterly cities and artistic expression. Each scent captures the essence of creative spaces and urban elegance.',
                'image': '/placeholder.svg',
                'is_featured': True,
                'order': 1
            },
            {
                'title': 'Botanical Library',
                'description': 'A refined collection drawn from botanical archives and rare plant essences. Natural compositions that celebrate the beauty of flora.',
                'image': '/placeholder.svg',
                'is_featured': True,
                'order': 2
            },
            {
                'title': 'Velvet Evenings',
                'description': 'Twilight rituals captured in luxurious fragrances. Deep, sensual scents designed for intimate moments and evening elegance.',
                'image': '/placeholder.svg',
                'is_featured': True,
                'order': 3
            },
            {
                'title': 'Citrus Garden',
                'description': 'Fresh and vibrant compositions featuring bright citrus notes. Energizing scents that evoke sun-drenched Mediterranean gardens.',
                'image': '/placeholder.svg',
                'is_featured': False,
                'order': 4
            },
            {
                'title': 'Amber & Spice',
                'description': 'Warm, exotic fragrances with rich amber and spice accords. Sophisticated blends that tell stories of distant lands.',
                'image': '/placeholder.svg',
                'is_featured': False,
                'order': 5
            },
            {
                'title': 'Floral Essence',
                'description': 'Timeless floral compositions celebrating the elegance of blooms. From delicate petals to bold bouquets.',
                'image': '/placeholder.svg',
                'is_featured': False,
                'order': 6
            },
        ]

        created_count = 0
        updated_count = 0

        for data in collections_data:
            collection, created = ProductCollection.objects.update_or_create(
                title=data['title'],
                defaults={
                    'description': data['description'],
                    'image': data['image'],
                    'is_featured': data['is_featured'],
                    'order': data['order'],
                    'is_active': True
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created collection: {collection.title}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'↻ Updated collection: {collection.title}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Completed! Created: {created_count}, Updated: {updated_count}'
            )
        )

from django.core.management.base import BaseCommand
from product_collections.models import ProductCollection


class Command(BaseCommand):
    help = 'Load luxury brand collections into the database'

    def handle(self, *args, **options):
        collections_data = [
            {
                'title': 'Prada',
                'description': 'Prada fragrances embody Italian sophistication and modern elegance. Known for their innovative and refined scents.',
                'image': '/placeholder.svg',
                'is_featured': True,
                'order': 1
            },
            {
                'title': 'YSL',
                'description': 'Yves Saint Laurent fragrances represent timeless luxury and bold sophistication. Iconic scents for the modern individual.',
                'image': '/placeholder.svg',
                'is_featured': True,
                'order': 2
            },
            {
                'title': 'Lancôme',
                'description': 'Lancôme offers elegant French fragrances that celebrate femininity and grace with exquisite craftsmanship.',
                'image': '/placeholder.svg',
                'is_featured': True,
                'order': 3
            },
            {
                'title': 'Chloe',
                'description': 'Chloé fragrances capture the essence of effortless Parisian chic with romantic and feminine compositions.',
                'image': '/placeholder.svg',
                'is_featured': True,
                'order': 4
            },
            {
                'title': 'Dior',
                'description': 'Christian Dior fragrances epitomize French luxury and haute couture elegance in every bottle.',
                'image': '/placeholder.svg',
                'is_featured': True,
                'order': 5
            },
            {
                'title': 'Jean Paul Gaultier',
                'description': 'Jean Paul Gaultier fragrances are bold, unconventional, and celebrate individuality with iconic designs.',
                'image': '/placeholder.svg',
                'is_featured': True,
                'order': 6
            },
            {
                'title': 'Giorgio Armani',
                'description': 'Giorgio Armani fragrances reflect Italian elegance and sophistication with timeless and refined compositions.',
                'image': '/placeholder.svg',
                'is_featured': True,
                'order': 7
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
                    self.style.SUCCESS(f'Created collection: {collection.title}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Updated collection: {collection.title}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nCompleted! Created: {created_count}, Updated: {updated_count}'
            )
        )

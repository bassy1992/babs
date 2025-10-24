from django.core.management.base import BaseCommand
from product_collections.models import ProductCollection


class Command(BaseCommand):
    help = 'Update collection images with high-quality Unsplash images'

    def handle(self, *args, **options):
        # Map collection titles to beautiful Unsplash images
        image_mapping = {
            'Atelier Collection': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop',
            'Botanical Library': 'https://images.unsplash.com/photo-1528150177500-4c6bb07b44f2?q=80&w=1400&auto=format&fit=crop',
            'Velvet Evenings': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop',
            'Citrus Garden': 'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1400&auto=format&fit=crop',
            'Amber & Spice': 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1400&auto=format&fit=crop',
            'Floral Essence': 'https://images.unsplash.com/photo-1604937455095-ef2fe3d842b6?q=80&w=1400&auto=format&fit=crop',
        }

        updated_count = 0

        for title, image_url in image_mapping.items():
            try:
                collection = ProductCollection.objects.get(title=title)
                collection.image = image_url
                collection.save()
                updated_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Updated image for: {collection.title}')
                )
            except ProductCollection.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'✗ Collection not found: {title}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Updated {updated_count} collection images'
            )
        )

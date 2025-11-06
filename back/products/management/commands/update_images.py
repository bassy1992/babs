from django.core.management.base import BaseCommand
from products.models import Product, ProductImage
from product_collections.models import ProductCollection


class Command(BaseCommand):
    help = 'Update all product and collection images with real URLs'

    def handle(self, *args, **kwargs):
        # Base URL for images
        base_url = 'https://tailsandtrailsmedia.sfo3.cdn.digitaloceanspaces.com/ENNC'
        
        # Product images mapping
        product_images = {
            'midnight-oud': f'{base_url}/dior-sauvage-elixir-eau-de-parfum-spray-300x300.avif',
            'ocean-breeze': f'{base_url}/dior-sauvage-elixir-eau-de-parfum-spray-300x300.avif',
            'spice-market': f'{base_url}/dior-sauvage-elixir-eau-de-parfum-spray-300x300.avif',
            'rose-garden': f'{base_url}/dior-sauvage-elixir-eau-de-parfum-spray-300x300.avif',
            'citrus-splash': f'{base_url}/dior-sauvage-elixir-eau-de-parfum-spray-300x300.avif',
            'amber-nights': f'{base_url}/dior-sauvage-elixir-eau-de-parfum-spray-300x300.avif',
        }
        
        # Collection images
        collection_images = {
            'Luxury Collection': f'{base_url}/dior-sauvage-elixir-eau-de-parfum-spray-300x300.avif',
            'Fresh & Clean': f'{base_url}/dior-sauvage-elixir-eau-de-parfum-spray-300x300.avif',
            'Oriental Spice': f'{base_url}/dior-sauvage-elixir-eau-de-parfum-spray-300x300.avif',
        }
        
        # Update products
        updated_products = 0
        for product_id, image_url in product_images.items():
            try:
                product = Product.objects.get(id=product_id)
                
                # Create or update product image
                ProductImage.objects.update_or_create(
                    product=product,
                    is_primary=True,
                    defaults={
                        'image_url': image_url,
                        'alt_text': f'{product.name} - Luxury Fragrance',
                        'order': 0
                    }
                )
                
                updated_products += 1
                self.stdout.write(self.style.SUCCESS(f'Updated images for: {product.name}'))
            except Product.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Product not found: {product_id}'))
        
        # Update collections
        updated_collections = 0
        for collection_title, image_url in collection_images.items():
            try:
                collection = ProductCollection.objects.get(title=collection_title)
                collection.image = image_url
                collection.save()
                
                updated_collections += 1
                self.stdout.write(self.style.SUCCESS(f'Updated image for collection: {collection.title}'))
            except ProductCollection.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Collection not found: {collection_title}'))
        
        self.stdout.write(self.style.SUCCESS(f'\nUpdate complete!'))
        self.stdout.write(self.style.SUCCESS(f'Updated {updated_products} products'))
        self.stdout.write(self.style.SUCCESS(f'Updated {updated_collections} collections'))

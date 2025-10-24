from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import (
    Product, ProductVariant, ProductHighlight, ProductImage,
    FragranceNote, RitualStep, Ingredient
)
from product_collections.models import ProductCollection
from decimal import Decimal


class Command(BaseCommand):
    help = 'Load 10 luxury fragrance products into the database'

    def handle(self, *args, **options):
        # First, ensure collections exist
        collections_data = [
            {
                'title': 'Atelier Collection',
                'description': 'Curated fragrances inspired by painterly cities and artistic expression. Each scent captures the essence of creative spaces and urban elegance.',
                'image': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop',
                'is_featured': True,
                'order': 1
            },
            {
                'title': 'Botanical Library',
                'description': 'A refined collection drawn from botanical archives and rare plant essences. Natural compositions that celebrate the beauty of flora.',
                'image': 'https://images.unsplash.com/photo-1528150177500-4c6bb07b44f2?q=80&w=1400&auto=format&fit=crop',
                'is_featured': True,
                'order': 2
            },
            {
                'title': 'Velvet Evenings',
                'description': 'Twilight rituals captured in luxurious fragrances. Deep, sensual scents designed for intimate moments and evening elegance.',
                'image': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop',
                'is_featured': True,
                'order': 3
            },
        ]

        collections = {}
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
            collections[data['title']] = collection
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created collection: {collection.title}'))

        # Product data
        products_data = [
            {
                'name': 'Noir Bouquet',
                'description': 'Velvety florals illuminated by smoked amber and rare Madagascan vanilla for a lingering, magnetic aura.',
                'story': 'Inspired by midnight garden salons in Paris, Noir Bouquet captures the contrast of blooming roses against crisp evening air.',
                'price': '89.00',
                'image': 'https://images.unsplash.com/photo-1604937455095-ef2fe3d842b6?q=80&w=1400&auto=format&fit=crop',
                'collection': 'Velvet Evenings',
                'is_bestseller': True,
                'gallery': [
                    'https://images.unsplash.com/photo-1604937455095-ef2fe3d842b6?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1549887534-1e8a0f3b4d9c?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1526745920543-275d4b786d9d?q=80&w=1600&auto=format&fit=crop',
                ],
                'accords': {
                    'top': ['Italian bergamot', 'Crushed fig leaf'],
                    'heart': ['Velvet rose', 'Saffron petal'],
                    'base': ['Smoked amber', 'Creamy sandalwood']
                },
                'ritual': [
                    'Mist once over hair to create a diffused trail.',
                    'Layer with Velvet Evenings oil on pulse points for depth.',
                    'Refresh mid-afternoon with the 10ml discovery vial.'
                ],
                'ingredients': ['Organic grain alcohol', 'Rose absolute', 'Fig leaf accord', 'Amber resin', 'Sandalwood', 'Vanilla bean'],
                'variants': [
                    {'label': 'Extrait 50ml', 'volume': '50ml', 'price': '89.00', 'sku': 'NB-50', 'stock': 25},
                    {'label': 'Extrait 100ml', 'volume': '100ml', 'price': '138.00', 'sku': 'NB-100', 'stock': 15},
                    {'label': 'Discovery 10ml', 'volume': '10ml', 'price': '32.00', 'sku': 'NB-10', 'stock': 50},
                ],
                'highlights': [
                    {'title': '12-hour sillage', 'description': 'High concentration extrait ensures a luxurious, enduring projection from day to evening.'},
                    {'title': 'Skin-first base', 'description': 'Crafted with organic sugarcane alcohol and nourishing botanicals for a soft, non-drying finish.'},
                    {'title': 'Responsible sourcing', 'description': 'Partnerships with fair-trade growers across Madagascar, Grasse, and Morocco.'},
                ]
            },
            {
                'name': 'Rose Velours',
                'description': 'A plush blend of rose de mai, blackcurrant bud, and cashmere woods that wraps the senses in warmth.',
                'story': 'Rose Velours nods to gilded lounges in Marrakech, where velvet drapes absorb candlelight and rose petals perfuse the air.',
                'price': '79.00',
                'image': 'https://images.unsplash.com/photo-1601688246360-68d1bb27b3f7?q=80&w=1400&auto=format&fit=crop',
                'collection': 'Botanical Library',
                'is_bestseller': True,
                'gallery': [
                    'https://images.unsplash.com/photo-1601688246360-68d1bb27b3f7?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1514866726862-0f081731e63f?q=80&w=1600&auto=format&fit=crop',
                ],
                'accords': {
                    'top': ['Pink pepper', 'Blackcurrant bud'],
                    'heart': ['Rose de mai', 'Indian jasmine'],
                    'base': ['Cashmere wood', 'White musk']
                },
                'ritual': [
                    'Pair with Botanical Library mist for a luminous floral cloud.',
                    'Apply to cashmere or silk scarves to enhance natural fibers.',
                ],
                'ingredients': ['Alcohol denat.', 'Rosa centifolia', 'Cassis absolute', 'Jasmine sambac', 'Cashmeran'],
                'variants': [
                    {'label': 'Parfum 50ml', 'volume': '50ml', 'price': '79.00', 'sku': 'RV-50', 'stock': 30},
                    {'label': 'Parfum 100ml', 'volume': '100ml', 'price': '126.00', 'sku': 'RV-100', 'stock': 20},
                ],
                'highlights': [
                    {'title': 'Soft-focus aura', 'description': 'Microfine musk accord diffuses on skin for a gossamer veil.'},
                    {'title': 'Cruelty-free', 'description': 'Certified vegan, no animal-derived ingredients or testing.'},
                ]
            },
            {
                'name': 'Amber Dusk',
                'description': 'Resinous amber swirled with roasted tonka and smoked vetiver, reminiscent of golden-hour bonfires.',
                'story': 'Amber Dusk traces the warmth of coastal sunsets, capturing the glow of embers and salted skin.',
                'price': '95.00',
                'image': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1400&auto=format&fit=crop',
                'collection': 'Velvet Evenings',
                'is_bestseller': False,
                'gallery': [
                    'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?q=80&w=1600&auto=format&fit=crop',
                ],
                'accords': {
                    'top': ['Pink pepper', 'Sea salt'],
                    'heart': ['Amber resin', 'Cedarwood'],
                    'base': ['Roasted tonka', 'Smoked vetiver']
                },
                'ritual': [
                    'Mist onto wrists and brush through hair for a luminous trail.',
                    'Blend with Noir Bouquet to dial up smokiness.',
                ],
                'ingredients': ['Alcohol denat.', 'Amber accord', 'Cedarwood', 'Tonka bean', 'Vetiver'],
                'variants': [
                    {'label': 'Parfum 50ml', 'volume': '50ml', 'price': '95.00', 'sku': 'AD-50', 'stock': 18},
                    {'label': 'Parfum 100ml', 'volume': '100ml', 'price': '148.00', 'sku': 'AD-100', 'stock': 12},
                ],
                'highlights': [
                    {'title': 'After-dusk energy', 'description': 'Built for evenings out with an addictive gourmand-amber finish.'},
                ]
            },
            {
                'name': 'Citrus Bloom',
                'description': 'Sunlit neroli entwined with yuzu zest and white tea for a sparkling, luminous lift.',
                'story': 'Citrus Bloom channels Riviera mornings, brimming with Mediterranean light and orchard breezes.',
                'price': '72.00',
                'image': 'https://images.unsplash.com/photo-1547887537-6158d64c30af?q=80&w=1400&auto=format&fit=crop',
                'collection': 'Botanical Library',
                'is_bestseller': False,
                'gallery': [
                    'https://images.unsplash.com/photo-1547887537-6158d64c30af?q=80&w=1600&auto=format&fit=crop',
                ],
                'accords': {
                    'top': ['Yuzu zest', 'Green mandarin'],
                    'heart': ['Orange blossom', 'White tea'],
                    'base': ['Musk', 'Hinoki']
                },
                'ritual': [
                    'Spritz before sunrise yoga for an energizing reset.',
                ],
                'ingredients': ['Alcohol denat.', 'Neroli', 'Yuzu', 'White tea', 'Musk accord'],
                'variants': [
                    {'label': 'Eau de parfum 50ml', 'volume': '50ml', 'price': '72.00', 'sku': 'CB-50', 'stock': 35},
                    {'label': 'Eau de parfum 100ml', 'volume': '100ml', 'price': '118.00', 'sku': 'CB-100', 'stock': 22},
                ],
                'highlights': [
                    {'title': 'Effervescent clarity', 'description': 'Bright citrus accord diffuses instantly for an uplifting start.'},
                ]
            },
            {
                'name': 'Velvet Oud',
                'description': 'Rich oud wood balanced with creamy sandalwood and hints of saffron for an opulent, mysterious scent.',
                'story': 'Velvet Oud evokes ancient spice markets and silk road caravans, where precious woods were traded like gold.',
                'price': '125.00',
                'image': 'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1400&auto=format&fit=crop',
                'collection': 'Atelier Collection',
                'is_bestseller': True,
                'gallery': [
                    'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1400&auto=format&fit=crop',
                ],
                'accords': {
                    'top': ['Saffron', 'Cardamom'],
                    'heart': ['Oud wood', 'Rose'],
                    'base': ['Sandalwood', 'Amber']
                },
                'ritual': [
                    'Apply to warm skin after shower for maximum projection.',
                ],
                'ingredients': ['Oud accord', 'Sandalwood', 'Saffron', 'Rose', 'Amber'],
                'variants': [
                    {'label': 'Extrait 50ml', 'volume': '50ml', 'price': '125.00', 'sku': 'VO-50', 'stock': 10},
                    {'label': 'Extrait 100ml', 'volume': '100ml', 'price': '195.00', 'sku': 'VO-100', 'stock': 8},
                ],
                'highlights': [
                    {'title': 'Luxury ingredients', 'description': 'Features authentic oud accord from sustainable sources.'},
                ]
            },
            {
                'name': 'Jasmine Noir',
                'description': 'Intoxicating jasmine sambac layered with dark patchouli and vanilla for a seductive evening scent.',
                'story': 'Jasmine Noir captures the essence of night-blooming flowers in a moonlit garden.',
                'price': '85.00',
                'image': 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1400&auto=format&fit=crop',
                'collection': 'Velvet Evenings',
                'is_bestseller': False,
                'gallery': [
                    'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1400&auto=format&fit=crop',
                ],
                'accords': {
                    'top': ['Bergamot', 'Mandarin'],
                    'heart': ['Jasmine sambac', 'Tuberose'],
                    'base': ['Patchouli', 'Vanilla']
                },
                'ritual': [
                    'Layer with body oil for enhanced longevity.',
                ],
                'ingredients': ['Jasmine absolute', 'Patchouli', 'Vanilla', 'Bergamot'],
                'variants': [
                    {'label': 'Parfum 50ml', 'volume': '50ml', 'price': '85.00', 'sku': 'JN-50', 'stock': 20},
                ],
                'highlights': [
                    {'title': 'Night blooming', 'description': 'Intensifies on warm skin for evening wear.'},
                ]
            },
            {
                'name': 'Bergamot Breeze',
                'description': 'Fresh bergamot and sea salt create an airy, coastal fragrance perfect for daytime.',
                'story': 'Bergamot Breeze captures the feeling of ocean spray and citrus groves along the Amalfi coast.',
                'price': '68.00',
                'image': 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1400&auto=format&fit=crop',
                'collection': 'Botanical Library',
                'is_bestseller': False,
                'gallery': [
                    'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1400&auto=format&fit=crop',
                ],
                'accords': {
                    'top': ['Bergamot', 'Sea salt', 'Lemon'],
                    'heart': ['Neroli', 'Lavender'],
                    'base': ['Driftwood', 'Musk']
                },
                'ritual': [
                    'Perfect for morning application.',
                ],
                'ingredients': ['Bergamot', 'Sea salt', 'Neroli', 'Musk'],
                'variants': [
                    {'label': 'Eau de toilette 50ml', 'volume': '50ml', 'price': '68.00', 'sku': 'BB-50', 'stock': 40},
                ],
                'highlights': [
                    {'title': 'Fresh & clean', 'description': 'Light and refreshing for everyday wear.'},
                ]
            },
            {
                'name': 'Sandalwood Silk',
                'description': 'Creamy sandalwood blended with iris and soft musks for an elegant, powdery finish.',
                'story': 'Sandalwood Silk embodies understated luxury and timeless sophistication.',
                'price': '92.00',
                'image': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1400&auto=format&fit=crop',
                'collection': 'Atelier Collection',
                'is_bestseller': False,
                'gallery': [
                    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1400&auto=format&fit=crop',
                ],
                'accords': {
                    'top': ['Bergamot', 'Violet'],
                    'heart': ['Iris', 'Sandalwood'],
                    'base': ['Musk', 'Vanilla']
                },
                'ritual': [
                    'Apply to pulse points for subtle elegance.',
                ],
                'ingredients': ['Sandalwood', 'Iris', 'Musk', 'Vanilla'],
                'variants': [
                    {'label': 'Parfum 50ml', 'volume': '50ml', 'price': '92.00', 'sku': 'SS-50', 'stock': 15},
                ],
                'highlights': [
                    {'title': 'Powdery elegance', 'description': 'Soft and sophisticated for any occasion.'},
                ]
            },
            {
                'name': 'Lavender Fields',
                'description': 'Pure lavender essence with hints of vanilla and tonka bean for a calming, aromatic experience.',
                'story': 'Lavender Fields transports you to the purple hills of Provence at sunset.',
                'price': '65.00',
                'image': 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=1400&auto=format&fit=crop',
                'collection': 'Botanical Library',
                'is_bestseller': False,
                'gallery': [
                    'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=1400&auto=format&fit=crop',
                ],
                'accords': {
                    'top': ['Lavender', 'Bergamot'],
                    'heart': ['Lavender absolute', 'Geranium'],
                    'base': ['Vanilla', 'Tonka bean']
                },
                'ritual': [
                    'Spray on pillow before sleep for relaxation.',
                ],
                'ingredients': ['Lavender', 'Vanilla', 'Tonka bean', 'Bergamot'],
                'variants': [
                    {'label': 'Eau de parfum 50ml', 'volume': '50ml', 'price': '65.00', 'sku': 'LF-50', 'stock': 45},
                ],
                'highlights': [
                    {'title': 'Calming aromatherapy', 'description': 'Promotes relaxation and peaceful sleep.'},
                ]
            },
            {
                'name': 'Midnight Musk',
                'description': 'Deep, sensual musk with leather and tobacco notes for a bold, masculine fragrance.',
                'story': 'Midnight Musk is inspired by late-night jazz clubs and leather-bound libraries.',
                'price': '98.00',
                'image': 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1400&auto=format&fit=crop',
                'collection': 'Atelier Collection',
                'is_bestseller': True,
                'gallery': [
                    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1400&auto=format&fit=crop',
                ],
                'accords': {
                    'top': ['Black pepper', 'Cardamom'],
                    'heart': ['Leather', 'Tobacco'],
                    'base': ['Musk', 'Patchouli']
                },
                'ritual': [
                    'Best applied in the evening for maximum impact.',
                ],
                'ingredients': ['Musk', 'Leather accord', 'Tobacco', 'Patchouli'],
                'variants': [
                    {'label': 'Extrait 50ml', 'volume': '50ml', 'price': '98.00', 'sku': 'MM-50', 'stock': 12},
                    {'label': 'Extrait 100ml', 'volume': '100ml', 'price': '155.00', 'sku': 'MM-100', 'stock': 8},
                ],
                'highlights': [
                    {'title': 'Bold & masculine', 'description': 'Intense and long-lasting for confident wear.'},
                ]
            },
        ]

        created_count = 0
        updated_count = 0

        for data in products_data:
            # Get collection
            collection = collections.get(data['collection'])
            
            # Create or update product
            slug = slugify(data['name'])
            product, created = Product.objects.update_or_create(
                slug=slug,
                defaults={
                    'id': slug,
                    'name': data['name'],
                    'description': data['description'],
                    'story': data['story'],
                    'price': Decimal(data['price']),
                    'collection': collection,
                    'is_bestseller': data['is_bestseller'],
                    'is_active': True,
                    'rating_average': Decimal('4.7'),
                    'rating_count': 150,
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'✓ Created product: {product.name}'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'↻ Updated product: {product.name}'))
            
            # Create product images (gallery)
            ProductImage.objects.filter(product=product).delete()
            for idx, image_url in enumerate(data['gallery']):
                ProductImage.objects.create(
                    product=product,
                    image_url=image_url,
                    order=idx,
                    is_primary=(idx == 0),
                )
            
            # Create fragrance notes
            FragranceNote.objects.filter(product=product).delete()
            for idx, note in enumerate(data['accords']['top']):
                FragranceNote.objects.create(
                    product=product,
                    note_type='top',
                    name=note,
                    order=idx,
                )
            for idx, note in enumerate(data['accords']['heart']):
                FragranceNote.objects.create(
                    product=product,
                    note_type='heart',
                    name=note,
                    order=idx,
                )
            for idx, note in enumerate(data['accords']['base']):
                FragranceNote.objects.create(
                    product=product,
                    note_type='base',
                    name=note,
                    order=idx,
                )
            
            # Create ritual steps
            RitualStep.objects.filter(product=product).delete()
            for idx, step in enumerate(data['ritual']):
                RitualStep.objects.create(
                    product=product,
                    step=step,
                    order=idx,
                )
            
            # Create ingredients
            Ingredient.objects.filter(product=product).delete()
            for idx, ingredient in enumerate(data['ingredients']):
                Ingredient.objects.create(
                    product=product,
                    name=ingredient,
                    order=idx,
                )
            
            # Create variants
            for variant_data in data['variants']:
                ProductVariant.objects.update_or_create(
                    product=product,
                    sku=variant_data['sku'],
                    defaults={
                        'label': variant_data['label'],
                        'volume': variant_data['volume'],
                        'price': Decimal(variant_data['price']),
                        'stock': variant_data['stock'],
                        'is_available': True,
                    }
                )
            
            # Create highlights
            for idx, highlight_data in enumerate(data['highlights']):
                ProductHighlight.objects.update_or_create(
                    product=product,
                    title=highlight_data['title'],
                    defaults={
                        'description': highlight_data['description'],
                        'order': idx + 1,
                    }
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Completed! Created: {created_count}, Updated: {updated_count}'
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                f'Total products in database: {Product.objects.count()}'
            )
        )
